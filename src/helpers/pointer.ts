import {Player} from "../objects/player";
import {GenerativeAgentsDevScene} from "../scenes/generative-agents-dev-scene";
import {DevScene} from "../scenes/dev";
import {setMouseAgent, setRealYamlKey} from "./memory-store";
import {GAME_OBJECT_DICT} from "../objects/maze";

export function updatePointerStatus(scene: GenerativeAgentsDevScene){
  const pointer = scene.input.activePointer
  const player = scene.player

  let moveleft = false;
  let moveright = false;
  let moveup = false;
  let movedown = false;
  if (pointer.primaryDown) {
    player.stopPath()
    let pointerPosition = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

    // Horizontal movement
    if (Math.abs(pointerPosition.x - player.x) > 15) {  // To avoid glitching when the player hits the cursor
      if (pointerPosition.x > player.x) {
        moveright = true;
      } else if (pointerPosition.x < player.x) {
        moveleft = true;
      }
    }
    // Vertical movement
    if (Math.abs(pointerPosition.y - player.y) > 15) {  // To avoid glitching when the player hits the cursor
      if (pointerPosition.y > player.y) {
        movedown = true;
      } else if (pointerPosition.y < player.y) {
        moveup = true;
      }
    }
    player.goTo(scene.navMesh, pointerPosition.x, pointerPosition.y)
  }

  if (scene.cursors.left.isDown /*|| scene.wasd.a.isDown*/) {
    moveleft = true;
  } else if (scene.cursors.right.isDown /*|| scene.wasd.d.isDown*/) {
    moveright = true;
  }

  // Vertical movement
  if (scene.cursors.up.isDown /*|| scene.wasd.w.isDown*/) {
    moveup = true;
  } else if (scene.cursors.down.isDown /*|| scene.wasd.s.isDown*/) {
    movedown = true;
  }
  player.update(scene, moveleft, moveright, moveup, movedown);
}

export function createTextSign(scene: DevScene){
  scene.signText = scene.add.bitmapText(0, 0, 'pixelop', "", 12, 1)
    .setOrigin(0, 1)
    .setDepth(101)
    .setVisible(false);

  scene.signPurple = scene.add.sprite(0, 0, "anims_ui", "purple.000").setOrigin(0, 1)
  scene.signRect = scene.add.rectangle(0, 0, scene.signText.width + 20, scene.signText.height, 0xffffff)
    .setStrokeStyle(1, 0x000000)
    .setOrigin(0, 1)
    .setDepth(100)
    .setVisible(false);
}

export function updatePointerPosition(scene: DevScene, pointerPosition: Phaser.Math.Vector2) {
  if (scene.maze.isCollision(pointerPosition.x, pointerPosition.y, 0, 0, scene.maze.objectInterAreas, 32)) {
    const pointerTileX = Math.floor(pointerPosition.x / 32)
    const pointerTileY = Math.floor(pointerPosition.y / 32)

    const objectDesc = scene.maze.getTileInfo([{x: pointerTileX, y:pointerTileY}], scene.maze.objectInterAreas, GAME_OBJECT_DICT)

    const pointerPosDesc = scene.maze.getPositionDesc(pointerTileX, pointerTileY, true)

    setMouseAgent(pointerPosDesc)

    scene.signText.setVisible(true)
    // scene.signRect.setVisible(true)
    scene.signPurple.setVisible(true)

    scene.signText.setText(objectDesc)
    scene.signText.setPosition(pointerPosition.x + 20, pointerPosition.y)

    // scene.signRect.width = scene.signText.width + 20
    // scene.signRect.setPosition(pointerPosition.x - 10, pointerPosition.y)

    scene.signPurple.setPosition(Math.floor(pointerPosition.x/32)*32, Math.floor(pointerPosition.y/32 + 1)*32)
    setRealYamlKey(pointerPosDesc)
    scene.pointer_update = true;
  } else if (scene.pointer_update){
    scene.pointer_update = false;
    setMouseAgent("")

    if (scene.player.isChatWithNpc()){
      scene.player.setChatNpc(scene.player.getChatNpc())
    }else if (scene.player.getPosition()){
      scene.player.setEventPosition(scene.player.getPosition())
    }

    scene.signText.setVisible(false)
    // scene.signRect.setVisible(false)
    scene.signPurple.setVisible(false)
  }

}
