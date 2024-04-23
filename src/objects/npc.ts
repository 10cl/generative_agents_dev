import {GenerativeAgentsDevScene} from "../scenes/generative-agents-dev-scene";
import {get_distance_between} from "../services/collisions.service";
import {Player, PLAYER_TEXTURE} from "./player";
import {DevScene} from "../scenes/dev";
import Phaser from "phaser";
import {
  getNpcTaskInfo,
  getPromptFlowNode,
  setMouseAgent,
  setRealYamlKey,
  setResponseStream
} from "../helpers/memory-store";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import {Bubble} from "./bubble";
import TextBox from "phaser3-rex-plugins/templates/ui/textbox/TextBox";
import {GAME_OBJECT_DICT, TIELD_HEIGHT, TIELD_WIDTH} from "./maze";
import {formatMessage, getNewTextDiff} from "../helpers/memory";
import PhaserNavMesh from "phaser-navmesh/src/phaser-navmesh";
export const NPC_FRAME = "down";

interface MovementData {
  movement: number[];
  pronunciatio: string;
  description: string;
  chat: string[][];
}

export class Npc extends Phaser.GameObjects.Sprite {
  private path: Phaser.Math.Vector2[] | null;
  private currentTarget: Phaser.Math.Vector2 | null;
  private speed: number;
  private distance: number;
  private short_memory: MovementData;
  public position: any;
  private short_memory_step: number;
  private rexUI: RexUIPlugin;
  private bubbleBox: TextBox;
  private preBubbleText: string;
  private devScene: DevScene;
  private nearNpc: Npc;

  private chat_with_player: boolean = false;
  private bubbleDestroyTimeout: NodeJS.Timeout;
  private destination: Phaser.Math.Vector2;
  private lastSpeakTime: number;

  constructor(scene: DevScene, name: string, x: number, y: number) {
    super(scene, x, y, name, NPC_FRAME);
    this.name = name;
    this.path = null;
    this.currentTarget = null;
    this.rexUI = scene.rexUI
    this.devScene = scene

    // Add the sprite and the physics body to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set the depth and the size
    this.setDepth(1);
    this.setSize(30, 40)

    this.displayWidth = 40;
    this.scaleY = this.scaleX

    // Create animations
    this.createAnims(scene);

    // Speed of movement
    this.speed = 1;

    this.setInteractive({useHandCursor: true}).on('pointerover', () => this.pointerOver(true)).on('pointerout', () => this.pointerOver(false))
  }

  public pointerOver(over: boolean){
    const scene = this.devScene;

    if (over){
      const objectDesc = this.name;
      setMouseAgent("Profile_" + this.name.replace(" ", "_"))

      scene.signText.setVisible(true)
      // scene.signPurple.setVisible(true)

      scene.signText.setText(objectDesc)
      scene.signText.setPosition(this.x + 20, this.y)

      // scene.signPurple.setPosition(Math.floor(this.x/32)*32, Math.floor(this.y/32 + 1)*32)
      setRealYamlKey("Profile_" + this.name.replace(" ", "_"))
    }else{
      setMouseAgent("")

      if (scene.player.isChatWithNpc()){
        scene.player.setChatNpc(scene.player.getChatNpc())
      }else if (scene.player.getPosition()){
        scene.player.setEventPosition(scene.player.getPosition())
      }

      scene.signText.setVisible(false)
      // scene.signPurple.setVisible(false)
    }
  }

  public stopPath(): void {
    console.error("stopPath");
    this.path = null;
    this.currentTarget = null;
  }

  public goTo(navMesh: PhaserNavMesh, x: number, y: number): void {
    this.destination = new Phaser.Math.Vector2(x, y);
    this.path = navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), this.destination);
    // console.trace("goto x: " +x + ", y: " + y)
    // console.log(this.path);

    if (this.path && this.path.length > 0)
      this.currentTarget = this.path.shift();
    else{
      if (!navMesh.isPointInMesh({x: this.x, y: this.y})){
        this.currentTarget = new Phaser.Math.Vector2(x, y);
        // console.log("go to x: " + x + ", y: " + y + "  player collision!!!")
      } else{
        // console.log("go to x: " + x + ", y: " + y + "  player not collision!!!")
        this.currentTarget = null
      }
    }

    // navMesh.debugDrawClear(); // Clears the overlay
    // navMesh.debugDrawPath(this.find_path, 0xfffd95);
  }

  private createAnims(scene: Phaser.Scene): void {
    const anims = scene.anims;
    const walkFramesConfig = {
      prefix: "",
      start: 0,
      end: 3,
      zeroPad: 3
    };

    ["left", "right", "down", "up"].forEach(direction => {
      anims.create({
        key: `${this.name}-${direction}-walk`,
        frames: anims.generateFrameNames(this.name, {
          ...walkFramesConfig,
          prefix: `${direction}-walk.`
        }),
        frameRate: 4,
        repeat: -1
      });
    });

  }

  shouldSpeakMemory() {
    return this.distance > 400
      && !this.isChatWithPlayer()
      && !getPromptFlowNode()
      && (!this.bubbleBox || !this.bubbleBox.isTyping)
      && (!this.getChatNpc() || (this.getChatNpc().bubbleBox && !this.getChatNpc().bubbleBox.isTyping));
  }

  public setChatNpc(npc: Npc){
    this.nearNpc = npc
  }

  public getChatNpc(){
    return this.nearNpc
  }

  public isChatWithNpc(){
    return this.nearNpc != undefined;
  }

  public speak(message: string, typing=true) {
    const delayTime = 1000 - (new Date().getTime() - this.lastSpeakTime)
    if (!typing && this.bubbleBox && this.bubbleBox.isTyping){
      clearTimeout(this.bubbleDestroyTimeout)
      this.bubbleDestroyTimeout = setTimeout(function (){
        if (npc)
          npc.speak(message, typing);
      }, delayTime > 0 && delayTime < 1000? delayTime: 1000);
      this.lastSpeakTime = new Date().getTime()
      return;
    }

    setResponseStream("")

    if (message === "") {
      return;
    }

    if (message == this.preBubbleText){
      return;
    }

    if (this.bubbleBox) {
      this.bubbleBox.destroy()
    }

    this.bubbleBox = new Bubble(this.rexUI).createTextBox(this.x - 20,
    this.y - 30, {
      wrapWidth: 500,
    }).setDepth(3).start(message, 20);


    this.rexUI.show(this);
    this.preBubbleText = message
    const npc = this;
    clearTimeout(this.bubbleDestroyTimeout)
    this.bubbleDestroyTimeout = setTimeout(function (){
      if (npc)
        npc.destroyBubble();
    }, 5000);
  }


  public isChatWithPlayer() {
    return this.chat_with_player;
  }

  public setChatWithPlayer(value: boolean) {
    this.chat_with_player = value;
  }

  public destroyBubble() {
    if (this.bubbleBox){
      this.bubbleBox.destroy()
      this.bubbleBox = undefined
    }
  }

  public speakDiff(message: string){
    message = formatMessage(message)
    const diff = getNewTextDiff(message, this.preBubbleText);
    if (message.startsWith(this.preBubbleText)) {
      if (!this.bubbleBox) {
        if (diff !== "") {
          this.speak(message, false)
        }
      } else {
        this.bubbleBox.appendText(diff);
      }
      this.preBubbleText = message;
    } else {
      this.destroyBubble()
      this.preBubbleText = "";
    }
  }


  public update(scene: DevScene, player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const prevVelocity = body.velocity.clone();

    this.distance = get_distance_between(this.x, this.y, player.x, player.y)

    /*if (this.bubbleBox && this.bubbleBox.isTyping){
      console.log(this.name + " is typing....")
    }*/

    if (this.shouldSpeakMemory()) {
      if (this.short_memory && this.short_memory.chat && this.short_memory.chat.length > 0) {
        if (this.short_memory.chat[0][0] === this.name){
          this.speak(this.short_memory.pronunciatio + " " + this.short_memory.chat[0][1])

          this.short_memory.chat.shift()

          if (this.short_memory.chat[0] && this.short_memory.chat[0][0]) {
            this.setChatNpc(scene.personas[this.short_memory.chat[0][0]])

            if (this.getChatNpc().short_memory && this.getChatNpc().short_memory.chat && this.getChatNpc().short_memory.chat.length > 0){
              this.getChatNpc().short_memory.chat.shift()
            }
          }else{
            this.setChatNpc(undefined)
          }
        }

      } else {
        if (scene.all_movement[scene.step] !== undefined && this.name in scene.all_movement[scene.step]) {
          this.short_memory = scene.all_movement[scene.step][this.name] as MovementData
          // console.log(this.short_memory)
          this.short_memory_step = scene.step
        }
        if (this.short_memory && this.short_memory.pronunciatio){
          // this.speak(this.short_memory.pronunciatio + " " + this.short_memory.description.split("@")[0])
          this.setChatNpc(undefined)
        }
      }
    }

    this.position = scene.maze.getPositionDesc(body.x, body.y);

    // update bubble
    //
    // this.updateMemory()
    if (scene.execute_count === scene.execute_count_max && this.short_memory && this.short_memory.movement) {
      const x = this.short_memory.movement[0] * TIELD_WIDTH;
      const y = this.short_memory.movement[1] * TIELD_HEIGHT;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
      this.currentTarget = new Phaser.Math.Vector2(x, y);
      /*if (distance < 5*TIELD_WIDTH) {
        this.currentTarget = new Phaser.Math.Vector2(x, y);
      }else if(distance < 15*TIELD_WIDTH){
        this.goTo(this.devScene.navMesh, x, y);
      }else{
        this.currentTarget = new Phaser.Math.Vector2(x, y);
      }*/
    }

    let moveright = false
    let moveleft = false;
    let movedown =false;
    let moveup = false;

    if (this.currentTarget){
      const {x, y} = this.currentTarget;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);

      if (distance < 5) {
        if (this.path && this.path.length > 0) this.currentTarget = this.path.shift();
        else this.currentTarget = null;
      }

      if (Math.abs(x - this.x) > 2) {
        if (x > this.x) moveright = true;
        else if (x < this.x) moveleft = true;
      }

      if (Math.abs(y - this.y) > 2) {
        if (y > this.y) movedown = true;
        else if (y < this.y) moveup = true;
      }
    }

    let tmpMoveX = 0;
    let tmpMoveY = 0;
    let left_walk_name = "left-walk";
    let right_walk_name = "right-walk";
    let down_walk_name = "down-walk";
    let up_walk_name = "up-walk";

    if (moveleft) {
      tmpMoveX = body.x - this.speed;
      this.anims.play(this.name + "-" + left_walk_name, true)
    } else if (moveright) {
      tmpMoveX = body.x + this.speed;
      this.anims.play(this.name + "-" + right_walk_name, true)
    }

    if (moveup) {
      tmpMoveY = body.y - this.speed;
      if (!(moveleft || moveright)) this.anims.play(this.name + "-" + up_walk_name, true)
    } else if (movedown) {
      tmpMoveY = body.y + this.speed;
      if (!(moveleft || moveright)) this.anims.play(this.name + "-" + down_walk_name, true)
    }

    if (tmpMoveX === 0) {
      tmpMoveX = body.x
    }
    if (tmpMoveY === 0) {
      tmpMoveY = body.y
    }

    if (this.currentTarget != null || !this.isCollision(scene, tmpMoveX, tmpMoveY)){
      if (tmpMoveX !== 0) body.x = tmpMoveX;
      if (tmpMoveY !== 0) body.y = tmpMoveY;
    }else {
      //console.log(this.currentTarget)
    }

    if (!(moveleft || moveright || moveup || movedown)) {
      this.anims.stop();
      if (prevVelocity.x < 0) this.setTexture(this.name, "left");
      else if (prevVelocity.x > 0) this.setTexture(this.name, "right");
      else if (prevVelocity.y < 0) this.setTexture(this.name, "down");
      else if (prevVelocity.y > 0) this.setTexture(this.name, "up");

    }

    if (this.bubbleBox !== undefined) {
      this.bubbleBox.x = this.x - 50;
      this.bubbleBox.y = this.y - 25;
    }

  }

  public findNearestPlayerPosition(walkArea: Phaser.Math.Vector2[], playerPosition: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    const distances = walkArea.map(pos => Phaser.Math.Distance.Between(pos.x, pos.y, playerPosition.x, playerPosition.y));
    const nearestPositionIndex = distances.indexOf(Math.min(...distances));
    return walkArea[nearestPositionIndex];
  }

  public moveNPCTowardsTarget(npc: Phaser.Math.Vector2, targetPosition: Phaser.Math.Vector2, stepSize: number = 1): Phaser.Math.Vector2 {
    const distance = Phaser.Math.Distance.Between(npc.x, npc.y, targetPosition.x, targetPosition.y);
    const alpha = stepSize / distance;
    return this.linearInterpolation(npc, targetPosition, alpha);
  }

  private linearInterpolation(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2, alpha: number): Phaser.Math.Vector2 {
    const interpolatedX = start.x + alpha * (end.x - start.x);
    const interpolatedY = start.y + alpha * (end.y - start.y);
    return new Phaser.Math.Vector2(interpolatedX, interpolatedY);
  }

  public gatherNPCs(scene: GenerativeAgentsDevScene, playerPosition: Phaser.Math.Vector2, numNPCs: number = 4): Phaser.Math.Vector2[] {
    function flattenArrayAroundPlayer(playerX: number, playerY: number, size: number): Phaser.Math.Vector2[] {
      const halfSize = Math.floor(size / 2);
      const walkArea = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => new Phaser.Math.Vector2(playerX - halfSize + i, playerY - halfSize + j))
      );
      return walkArea.reduce((flat, current) => flat.concat(current), []);
    }

    const areaSize = 18;
    const walkArea = flattenArrayAroundPlayer(playerPosition.x, playerPosition.y, areaSize);

    const n = numNPCs;
    const array2D = walkArea;
    const chunkSize = Math.ceil(array2D.length / n);
    const chunks = Array.from({ length: n }, (_, i) => array2D.slice(i * chunkSize, (i + 1) * chunkSize));

    const randomNumbers = chunks.map(chunk => {
      if (chunk.length === 0) return undefined;
      let count = 0;
      let randomIndex = Math.floor(Math.random() * chunk.length);
      while (!scene.maze.isCollision(chunk[randomIndex].x * 32, chunk[randomIndex].y * 32)) {
        randomIndex = Math.floor(Math.random() * chunk.length);
        count++;
        if (count > 100) break;
      }
      return chunk[randomIndex];
    });
    console.error("randomNumbers: " + randomNumbers);
    return randomNumbers.filter(num => num !== undefined) as Phaser.Math.Vector2[];
  }

  getDistance(){
    return this.distance
  }

  getShortMemory(){
    return this.short_memory == undefined? {} as MovementData: this.short_memory
  }

  private isCollision(scene: DevScene, tmpMoveX: number, tmpMoveY: number) {
    // return !scene.navMesh.isPointInMesh({x: tmpMoveX + this.displayWidth / 2, y: tmpMoveY + this.displayHeight / 2})
    // console.log("tmpMoveX: " + tmpMoveX + ", tmpMoveY: " + tmpMoveY)
    const collisionLayer = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.collisionLayer)
    const wallCollision = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.wallLayer)
    return collisionLayer || wallCollision
  }
}
