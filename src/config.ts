import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {BaseScene} from "./scenes/base";
import { PhaserNavMeshPlugin } from "phaser-navmesh";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Generative Agents Dev',
  url: 'https://github.com/10cl/generative_agents_dev',
  version: '0.0.1',
  type: Phaser.AUTO,
  parent: 'game-container',
  scene: [BaseScene],
  //backgroundColor: '#ededed',
  // render: { pixelArt: true, antialias: true },
  pixelArt: true,
  autoRound: true,
  autoFocus: true,
  fps: {
    target: 15
  },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,  // Remove in production
      debug: false,
      gravity: {x: 0, y: 0}
    }
  },
  plugins: {
    scene: [
      // https://github.com/mikewesthad/navmesh
      {
        key: "NavMeshPlugin", // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true
      },
      // https://github.com/rexrainbow/phaser3-rex-notes
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      }
    ]
  },
};
