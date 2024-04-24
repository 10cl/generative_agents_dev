import {GenerativeAgentsDevScene} from "../scenes/generative-agents-dev-scene";
import PhaserNavMesh from "phaser-navmesh/src/phaser-navmesh";
import Phaser from "phaser";
import {Npc} from "./npc";
import {DevScene} from "../scenes/dev";
import {
  getRealYaml,
  setMouseAgent,
  setPlayerMark,
  setRealYamlKey,
  setResponseStream,
  setStore
} from "../helpers/memory-store";
import {DEFAULT_POSITION, GAME_OBJECT_DICT, SECTOR_DICT, TIELD_WIDTH} from "./maze";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import {Bubble} from "./bubble";
import TextBox from "phaser3-rex-plugins/templates/ui/textbox/TextBox";
import {formatMessage, getNewTextDiff} from "../helpers/memory";
import {get_distance_between} from "../services/collisions.service";

export const PLAYER_TEXTURE = "player_atlas_json";
export const PLAYER_FRAME = "ariel-front";

export class Player extends Phaser.GameObjects.Sprite implements PlayerGlobal{
  private path: Phaser.Math.Vector2[] | null;
  private currentTarget: Phaser.Math.Vector2 | null;
  speed: number;
  private destination: Phaser.Math.Vector2;
  private distance: number;
  private nearNpc: Npc = undefined;
  private nearNpcs: Npc[] = [];
  public position: string;
  private rexUI: RexUIPlugin;
  private bubbleBox: TextBox;
  private preBubbleText: string;
  private devScene: DevScene;
  private bubbleDestroyTimeout: NodeJS.Timeout;
  private fixPath: boolean;
  private lastSpeakTime: number;

  constructor(scene: DevScene, x: number, y: number) {
    super(scene, x, y, PLAYER_TEXTURE, PLAYER_FRAME);
    this.name = "Bob_Green"
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

    // Create animations
    this.createAnims(scene);

    // Speed of movement
    this.speed = 1;

    // global.
    window.player = this;
  }

  public stopPath(): void {
    console.error("stopPath");
    this.path = null;
    this.currentTarget = null;
    this.destination = null;
  }

  public goTo(navMesh: PhaserNavMesh, x: number, y: number): void {
    this.destination = new Phaser.Math.Vector2(x, y);
    this.path = navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), this.destination);
    console.trace("goto x: " +x + ", y: " + y)
    console.log(this.path);

    if (this.path && this.path.length > 0)
      this.currentTarget = this.path.shift();
    else{
      if (!navMesh.isPointInMesh({x: this.x, y: this.y})){
        this.currentTarget = new Phaser.Math.Vector2(x, y);
        console.log("go to x: " + x + ", y: " + y + "  player collision!!!")
        this.fixPath = true;
      } else{
        console.log("go to x: " + x + ", y: " + y + "  player not collision!!!")
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

    ["left", "right", "front", "back"].forEach(direction => {
      anims.create({
        key: `ariel-${direction}-walk`,
        frames: anims.generateFrameNames(PLAYER_TEXTURE, {
          ...walkFramesConfig,
          prefix: `ariel-${direction}-walk.`
        }),
        frameRate: 10,
        repeat: -1
      });
    });

    anims.create({
      key: "ariel-wave",
      frames: anims.generateFrameNames(PLAYER_TEXTURE, {
        prefix: "ariel-wave.",
        start: 0,
        end: 4,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  public setDistance(distance: number){
    this.distance = distance
  }

  public setEventPosition(position: string){
    setPlayerMark(position)
    if (position === undefined || getRealYaml() === undefined) {
      setPlayerMark(DEFAULT_POSITION)
      if (getRealYaml() === undefined) {
        setPlayerMark("Default_Flow_Dag_Yaml")
      }
    }
  }

  public getPosition(){
    return this.position
  }

  public setChatNpc(npc: Npc){
    this.nearNpc = npc
    if (npc != undefined){
      setRealYamlKey("Profile_" + npc.name.replace(" ", "_"))
    }else{
      setRealYamlKey("the Ville")
    }
  }

  public setNearNpcs(nearNpcs: Npc[]){
    this.nearNpcs = nearNpcs
  }

  public perceiveEvent() {
    let game_player_perceived_event = ""
    for (let i = 0; i < this.nearNpcs.length; i++) {
      const npc = this.nearNpcs[i]
      game_player_perceived_event += npc.name + " in " + npc.position

      if (this.nearNpcs[i].getShortMemory()) {
        if (this.nearNpcs[i].getShortMemory().description){
          game_player_perceived_event += " " + npc.getShortMemory().description
        }
        if (this.nearNpcs[i].getShortMemory().chat){
          game_player_perceived_event += "\nConversation: " + this.nearNpcs[i]['chat'] + "\n"
        }
      }
    }
    return game_player_perceived_event
  }


  public perceiveChatEvent() {
    let game_npc_event = ""
    if (this.getChatNpc() && this.getChatNpc().getShortMemory() && this.getChatNpc().getShortMemory().description) {
      game_npc_event = this.getChatNpc().getShortMemory().description
    }
    return game_npc_event
  }

  public perceiveSpace() {
    const playerTile = [Math.floor(this.x / 32), Math.floor(this.y / 32)]
    const player_position = this.devScene.maze.getPositionDesc(this.x, this.y)
    let playerSectorDesc = this.devScene.maze.getPositionDesc(this.x, this.y, false, 1)
    if (playerSectorDesc === "") {
      playerSectorDesc = DEFAULT_POSITION
    }
    const nearByTiles = this.devScene.maze.getNearbyTiles(this, playerTile, 10);
    const nearSector = []
    const nearObject = []
    for (let i = 0; i < nearByTiles.length; i++) {
      const [x, y] = nearByTiles[i];
      const sectorDesc = this.devScene.maze.getTileInfo([x, y], this.devScene.maze.sectorJsonAreas, SECTOR_DICT)
      if (sectorDesc !== "") {
        if (nearSector.indexOf(sectorDesc) === -1) {
          nearSector.push(sectorDesc)
        }
        if (sectorDesc === playerSectorDesc) {
          // 附近的家具
          const objectDesc = this.devScene.maze.getTileInfo([x, y], this.devScene.maze.objectInterAreas, GAME_OBJECT_DICT)
          if (sectorDesc !== "" && nearObject.indexOf(objectDesc) === -1) {
            nearObject.push(objectDesc)
          }
        }
      }
    }

    let game_player_perceived_space = "You are in " + player_position + "\n"
    if (nearSector.length > 0) {
      game_player_perceived_space += "there are some building near you: \n"
      for (let i = 0; i < nearSector.length; i++) {
        game_player_perceived_space += nearSector[i] + "\n"
      }
      game_player_perceived_space += "\n"
    }

    if (nearObject.length > 0) {
      game_player_perceived_space += "In " + playerSectorDesc + ", there are some furniture near you: "
      for (let i = 0; i < nearObject.length; i++) {
        game_player_perceived_space += nearObject[i] + "\n"
      }
      game_player_perceived_space += "\n"
    }
    return game_player_perceived_space
  }


  public getChatNpc(){
    return this.nearNpc
  }

  public isChatWithNpc(){
    return this.nearNpc != undefined;
  }

  public speak(message: string, typing=true) {
    const delayTime = 1000 - (new Date().getTime() - this.lastSpeakTime)
    if (message.length < 14){
      message += "          "
    }
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
      if (this.bubbleBox == undefined) {
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

  public update(scene: DevScene, moveleft: boolean, moveright: boolean, moveup: boolean, movedown: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const prevVelocity = body.velocity.clone();
    body.setVelocity(0);

    if (!moveleft && !moveright && !moveup && !movedown && this.currentTarget) {
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

    // TODO: fix
    if (this.fixPath){
      if (this.devScene.navMesh.isPointInMesh({x: this.x, y: this.y})){
        this.fixPath = false;
        console.log("fix navmesh search path")
        this.goTo(this.devScene.navMesh, this.destination.x, this.destination.y);
      }
    }

    let tmpMoveX = 0;
    let tmpMoveY = 0;

    if (moveleft) {
      tmpMoveX = body.x - this.speed;
      this.anims.play("ariel-left-walk", true);
    } else if (moveright) {
      tmpMoveX = body.x + this.speed;
      this.anims.play("ariel-right-walk", true);
    }

    if (moveup) {
      tmpMoveY = body.y - this.speed;
      if (!(moveleft || moveright)) this.anims.play("ariel-back-walk", true);
    } else if (movedown) {
      tmpMoveY = body.y + this.speed;
      if (!(moveleft || moveright)) this.anims.play("ariel-front-walk", true);
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
      console.log(this.currentTarget)
    }

    if (!(moveleft || moveright || moveup || movedown) && !(this.anims.currentAnim == null || this.anims.currentAnim.key === 'ariel-wave')) {
      this.anims.stop();
      if (prevVelocity.x < 0) this.setTexture(PLAYER_TEXTURE, "ariel-left");
      else if (prevVelocity.x > 0) this.setTexture(PLAYER_TEXTURE, "ariel-right");
      else if (prevVelocity.y < 0) this.setTexture(PLAYER_TEXTURE, "ariel-back");
      else if (prevVelocity.y > 0) this.setTexture(PLAYER_TEXTURE, "ariel-front");
    }

    this.position = scene.maze.getPositionDesc(body.x +  this.displayWidth / 2, body.y +  this.displayHeight / 2);
    setStore("player_pos", {x: body.x, y: body.y});
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
      const walkArea = Array.from({length: size}, (_, i) =>
        Array.from({length: size}, (_, j) => new Phaser.Math.Vector2(playerX - halfSize + i, playerY - halfSize + j))
      );
      return walkArea.reduce((flat, current) => flat.concat(current), []);
    }

    const areaSize = 18;
    const walkArea = flattenArrayAroundPlayer(playerPosition.x, playerPosition.y, areaSize);

    const n = numNPCs;
    const array2D = walkArea;
    const chunkSize = Math.ceil(array2D.length / n);
    const chunks = Array.from({length: n}, (_, i) => array2D.slice(i * chunkSize, (i + 1) * chunkSize));

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

  private isCollision(scene: DevScene, tmpMoveX: number, tmpMoveY: number) {
    // return !scene.navMesh.isPointInMesh({x: tmpMoveX + this.displayWidth / 2, y: tmpMoveY + this.displayHeight / 2})
    // console.log("tmpMoveX: " + tmpMoveX + ", tmpMoveY: " + tmpMoveY)
    const collisionLayer = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.collisionLayer)
    const wallCollision = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.wallLayer)
    return collisionLayer || wallCollision
  }
}
