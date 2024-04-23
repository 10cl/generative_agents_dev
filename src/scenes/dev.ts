import PhaserNavMeshPlugin from "phaser-navmesh/src/phaser-navmesh-plugin";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Phaser from "phaser";
import {Player, PLAYER_TEXTURE} from "../objects/player";
import PhaserNavMesh from "phaser-navmesh/src/phaser-navmesh";
import Sprite = Phaser.GameObjects.Sprite;
import Maze, {NPC_PREDEFINED} from "../objects/maze";
import {Npc} from "../objects/npc";

export class DevScene extends Phaser.Scene {
  maze: Maze;
  navMeshPlugin!: PhaserNavMeshPlugin;
  rexUI!: RexUIPlugin;
  navMesh: PhaserNavMesh;
  player: Player;
  personas: {[key: string]: Npc};

  // data
  all_movement: any;

  // step
  step: number;
  execute_count_max: number;
  execute_count: number;

  // sign
  signText: Phaser.GameObjects.BitmapText;
  signRect: Phaser.GameObjects.Rectangle;
  signPurple: Phaser.GameObjects.Sprite;
  pointer_update: boolean;

  constructor() {
    super({
      key: 'DevScene'
    });
  }

  preload(): void {
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
    console.log("preload")
    this.load.pack('preload', './assets/pack.json', 'preload');

    // atlas
    this.load.atlas(PLAYER_TEXTURE, "./assets/sprites/player.png", "./assets/animations/player_atlas.json");
    for (const name in NPC_PREDEFINED) {
      this.load.atlas(name, "./assets/sprites/" + name.replace(" ", "_") + ".png", "./assets/animations/characters_atlas.json");
    }
    this.load.atlas("anims_ui", "./assets/tiles/anims_ui.png", "./assets/animations/anims_ui.json");
  }

  create(): void{
    console.log("create")

  }

  init(): void {
    console.log("init")
    // Init grid instance
  }

  update() {
    console.log("update")
  }

}
