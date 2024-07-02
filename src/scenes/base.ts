import Phaser from "phaser";
import Utils from "../helpers/utils";
import Maze, {NPC_PREDEFINED, TIELD_WIDTH} from "../objects/maze";
import {
  getPromptFlowNode,
  getPendingMessage,
  getResponseStream,
  getStore,
  isGamePause,
  isGameWindow,
  isHookedResponse,
  setPendingMessage,
  setStore, setStep, setResponseStream, getTaskNodeValue, setTaskNodeValue, getTask, getMouseNotInGame, getRealYamlKey,
} from "../helpers/memory-store";
import { DevScene } from "./dev";
import { loadLongMemory } from "../helpers/memory";
import {Npc} from "../objects/npc";
import {MusicButton} from "../objects/UIButton";
import {PromptFlowNode} from "promptflowx";
import {createTextSign, updatePointerPosition} from "../helpers/pointer";

export class BaseScene extends DevScene {
  private utils: Utils;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private input_time: Date;
  private tmp_short_distance_name: string;
  private pendingPosition: string;
  private prePosition: string;
  private interactionCollisionArray: string[];
  private interactionCollisionTimeArray: { [key: string]: Date };
  private isSeminar: boolean;
  private promptNode: PromptFlowNode = undefined;

  create(): void{
    this.utils = new Utils();
    this.maze = new Maze();
    this.maze.initMap(this, "GenerativeAgentsDevMap");
    createTextSign(this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.maze.preloadNpcSprites(this);
    this.input_time = new Date();
    this.tmp_short_distance_name = "";
    this.pendingPosition = "";
    this.prePosition = "";
    this.interactionCollisionArray = [];
    this.interactionCollisionTimeArray = {};
    this.isSeminar = false;
    this.execute_count_max = TIELD_WIDTH / this.player.speed;
    this.execute_count = this.execute_count_max;

    this.utils.refreshStep(this);
    new MusicButton(this, 80, 45, 'mute', 'play');
    loadLongMemory().then(movement => {
      if (movement) {
        this.all_movement = movement;
        window.movement = movement;
      }
      const loadingEle = document.getElementById('loading');
      if (loadingEle) {
        loadingEle.style.display = 'none';
      }
    });

    let player_init = getStore("player_init", 0);
    if (player_init < 2) {
      setStore("player_init", 0);
    }
  }

  update(): void {
    super.update()
    if (isGamePause()) {
      this.scene.pause();
    }

    const pointer = this.input.activePointer;
    let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    updatePointerPosition(this, pointerPosition)

    let player_pending_text = getPendingMessage();
    let response_update_text = getResponseStream();
    let gameMode = isGameWindow();

    if (this.step > 7550) {
      this.utils.refreshStep(this);
    }

    if (this.all_movement === undefined) {
      return;
    }

    let moveleft = false;
    let moveright = false;
    let moveup = false;
    let movedown = false;

    if (pointer.primaryDown && !getMouseNotInGame()) {
      this.player.stopPath()
      let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      if (Math.abs(pointerPosition.x - this.player.x) > 15) {
        if (pointerPosition.x > this.player.x) {
          moveright = true;
        } else if (pointerPosition.x < this.player.x) {
          moveleft = true;
        }
      }
      if (Math.abs(pointerPosition.y - this.player.y) > 15) {
        if (pointerPosition.y > this.player.y) {
          movedown = true;
        } else if (pointerPosition.y < this.player.y) {
          moveup = true;
        }
      }
      this.player.goTo(this.navMesh, pointerPosition.x, pointerPosition.y);
    }

    if (this.cursors.left.isDown) {
      moveleft = true;
    } else if (this.cursors.right.isDown) {
      moveright = true;
    }
    if (this.cursors.up.isDown) {
      moveup = true;
    } else if (this.cursors.down.isDown) {
      movedown = true;
    }

    this.player.update(this, moveleft, moveright, moveup, movedown);

    if (this.all_movement === undefined) {
      return;
    }

    let tmp_short_distance = 200;
    let temp_closed_npc: any;

    const near_npc: Npc[] = [];
    for (const npc of Object.values(this.personas)) {
      npc.update(this, this.player);
      if (!this.player.isChatWithNpc()) {
        if (npc.getDistance() < tmp_short_distance) {
          tmp_short_distance = npc.getDistance();
          temp_closed_npc = npc;
        }
      }else if (npc.name == this.player.getChatNpc().name){
        tmp_short_distance = npc.getDistance()
      }
      if (npc.getDistance() < 400 && npc.getShortMemory()) {
        near_npc.push(npc);
      }
    }

    this.player.setNearNpcs(near_npc);

    if (gameMode) {
      let player_position = this.player.getPosition();
      if (player_pending_text !== "") {
        setPendingMessage("");
        this.cameras.main.startFollow(this.player, true);
        this.player.speak(player_pending_text, true);
      } else {
        if (response_update_text !== "") {
          let promptNode = getPromptFlowNode();
          if (promptNode == undefined) {
            promptNode = this.promptNode;
          }
          this.input_time = new Date();
          let speaker;
          const yamlKeySpeaker = getRealYamlKey().replace("Profile_", "").replace("_", " ");
          if(Object.keys(NPC_PREDEFINED).indexOf(yamlKeySpeaker) != -1){
            speaker = this.personas[yamlKeySpeaker]
          }else{
            speaker = (promptNode && promptNode.role && promptNode.role.npc) ? this.personas[promptNode.role.npc] : this.player;
          }
          speaker.speak(response_update_text, false);
          this.promptNode = promptNode;

          this.cameras.main.startFollow(speaker, true);
        } else {
          if (!this.player.isChatWithNpc()) {
            if (!this.isSeminar && this.isPositionChanged(player_position)) {
              this.player.destroyBubble();
              if (player_position !== undefined && this.isCollisionUpdate(player_position) && new Date().getTime() - this.input_time.getTime() > 2000) {
                this.interactionCollisionArray.push(player_position);
                this.player.setEventPosition(player_position);
              }
              this.prePosition = player_position;
            } else if (!this.isSeminar && tmp_short_distance < 100 && temp_closed_npc && new Date().getTime() - this.input_time.getTime() > 2000) {
              this.player.setChatNpc(temp_closed_npc);
              temp_closed_npc.setChatWithPlayer(true);
              if (temp_closed_npc.getDistance() > 100) {
                this.player.goTo(this.navMesh, temp_closed_npc.x, temp_closed_npc.y);
              }
            }
          } else {
            if (tmp_short_distance > 200) {
              this.cameras.main.startFollow(this.player, true);
              this.utils.deactivateButton(this);
              this.player.destroyBubble();
              this.player.getChatNpc().setChatWithPlayer(false);
              this.player.setChatNpc(undefined);
            }
          }
        }
      }
    }

    if (this.execute_count === 0) {
      this.execute_count = this.execute_count_max + 1;
      this.step++;
      setStep(this.step)
    }

    this.execute_count--;
  }

  private isCollisionUpdate(collision_name: string): boolean {
    let currentDate = new Date();
    for (let i = 0; i < this.interactionCollisionArray.length; i++) {
      if (this.interactionCollisionArray[i] === collision_name) {
        if (this.interactionCollisionTimeArray[collision_name] !== undefined
          && currentDate.getTime() - this.interactionCollisionTimeArray[collision_name].getTime() > 2 * 60 * 1000) {
          this.interactionCollisionTimeArray[collision_name] = new Date();
          return true;
        }
        this.interactionCollisionTimeArray[collision_name] = new Date();
        return false;
      }
    }
    return true;
  }

  private isPositionChanged(player_position: string): boolean {
    return this.prePosition !== player_position;
  }

  private endWaitSummary(): void {
    setStore("response_update_text", "");
  }
}
