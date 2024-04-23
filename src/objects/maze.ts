
import {getStore} from "../helpers/memory-store";
import {BaseScene} from "../scenes/base";
import {Player, PLAYER_TEXTURE} from "../objects/player";

import {Npc} from "../objects/npc";
import {DevScene} from "../scenes/dev";
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

export const DEFAULT_POSITION = "the Ville";

export const MAZE_WIDTH = 180
export const MAZE_HEIGHT = 100

export const TIELD_WIDTH = 32
export const TIELD_HEIGHT = 32

export const NPC_PREDEFINED = {
  "Maria Lopez": [123, 57],
  "John Lin": [90, 74],
  "Sam Moore": [39, 62],
  "Giorgio Rossi": [87, 18],
  "Carmen Ortiz": [58, 74],
  "Ayesha Khan": [118, 61],
  "Hailey Johnson": [26, 32],
  "Adam Smith": [22, 65],
  "Eddy Lin": [94, 74],
  "Tamara Taylor": [54, 74],
  "Klaus Mueller": [127, 46],
  "Abigail Chen": [36, 18],
  "Jane Moreno": [72, 74],
  "Latoya Williams": [16, 18],
  "Francisco Lopez": [16, 32],
  "Carlos Gomez": [93, 18],
  "Ryan Park": [66, 19],
  "Wolfgang Schulz": [111, 60],
  "Arthur Burton": [54, 14],
  "Isabella Rodriguez": [72, 14],
  "Jennifer Moore": [37, 68],
  "Tom Moreno": [73, 74],
  "Rajiv Patel": [25, 18],
  "Yuriko Yamamoto": [29, 65],
  "Mei Lin": [90, 74]
};

export const SECTOR_DICT = {
  32125: "You family's house",
  32135: "artist's co-living space",
  32145: "Arthur Burton's apartment",
  32155: "Ryan Park's apartment ",
  32165: "Isabella Rodriguez's apartment",
  32175: "Giorgio Rossi's apartment",
  32185: "Carlos Gomez's apartment",
  32195: "The Rose and Crown Pub",
  32136: "Hobbs Cafe",
  32146: "Oak Hill College",
  32156: "Johnson Park",
  32166: "Harvey Oak Supply Store",
  32176: "The Willows Market and Pharmacy",
  32186: "Adam Smith's house",
  32196: "Yuriko Yamamoto's house",
  32137: "Moore family's house",
  32147: "Tamara Taylor and Carmen Ortiz's house",
  32157: "Moreno family's house",
  32167: "Lin family's house",
  32177: "Dorm for Oak Hill College"
}

export const SPAWNING_LOCATION_BLOCKS = {
  32285: "artist's co-living space, Latoya Williams's room, sp-A",
  32295: "artist's co-living space, Rajiv Patel's room, sp-A",
  32305: "artist's co-living space, Rajiv Patel's room, sp-B",
  32315: "artist's co-living space, Abigail Chen's room, sp-A",
  32286: "artist's co-living space, Francisco Lopez's room, sp-A",
  32296: "artist's co-living space, Hailey Johnson's room, sp-A",
  32306: "Arthur Burton's apartment, main room, sp-A",
  32316: "Arthur Burton's apartment, main room, sp-B",
  32287: "Ryan Park's apartment, main room, sp-A",
  32297: "Ryan Park's apartment, main room, sp-B",
  32307: "Isabella Rodriguez's apartment, main room, sp-A",
  32317: "Isabella Rodriguez's apartment, main room, sp-B",
  32288: "Giorgio Rossi's apartment, main room, sp-A",
  32298: "Giorgio Rossi's apartment, main room, sp-B",
  32308: "Carlos Gomez's apartment, main room, sp-A",
  32318: "Carlos Gomez's apartment, main room, sp-B",
  32289: "Adam Smith's house, main room, sp-A",
  32299: "Adam Smith's house, main room, sp-B",
  32309: "Yuriko Yamamoto's house, main room, sp-A",
  32319: "Yuriko Yamamoto's house, main room, sp-B",
  32290: "Moore family's house, main room, sp-A",
  32300: "Moore family's house, main room, sp-B",
  32310: "Tamara Taylor and Carmen Ortiz's house, Tamara Taylor's room, sp-A",
  32320: "Tamara Taylor and Carmen Ortiz's house, Tamara Taylor's room, sp-B",
  32291: "Tamara Taylor and Carmen Ortiz's house, Carmen Ortiz's room, sp-A",
  32301: "Tamara Taylor and Carmen Ortiz's house, Carmen Ortiz's room, sp-B",
  32311: "Moreno family's house, Tom and Jane Moreno's bedroom, sp-A",
  32321: "Moreno family's house, Tom and Jane Moreno's bedroom, sp-B",
  32292: "Moreno family's house, empty bedroom, sp-A",
  32302: "Moreno family's house, empty bedroom, sp-B",
  32312: "Lin family's house, Mei and John Lin's bedroom, sp-A",
  32322: "Lin family's house, Mei and John Lin's bedroom, sp-B",
  32293: "Lin family's house, Eddy Lin's bedroom, sp-A",
  32303: "Lin family's house, Eddy Lin's bedroom, sp-B",
  32313: "Dorm for Oak Hill College, Klaus Mueller's room, sp-A",
  32323: "Dorm for Oak Hill College, Klaus Mueller's room, sp-B",
  32294: "Dorm for Oak Hill College, Maria Lopez's room, sp-A",
  32304: "Dorm for Oak Hill College, Ayesha Khan's room, sp-A",
  32314: "Dorm for Oak Hill College, Ayesha Khan's room, sp-B",
  32324: "Dorm for Oak Hill College, Wolfgang Schulz's room, sp-A"
}

export const ARENA_BLOCKS_DICT = {
  32138: "artist's co-living space, Latoya Williams's room",
  32148: "artist's co-living space, Latoya Williams's bathroom",
  32158: "artist's co-living space, Rajiv Patel's room",
  32168: "artist's co-living space, Rajiv Patel's bathroom",
  32178: "artist's co-living space, Abigail Chen's room",
  32188: "artist's co-living space, Abigail Chen's bathroom",
  32198: "artist's co-living space, Francisco Lopez's room",
  32139: "artist's co-living space, Francisco Lopez's bathroom",
  32149: "artist's co-living space, Hailey Johnson's room",
  32159: "artist's co-living space, Hailey Johnson's bathroom",
  32179: "artist's co-living space, common room",
  32189: "artist's co-living space, kitchen",
  32199: "Arthur Burton's apartment, main room",
  32140: "Arthur Burton's apartment, bathroom",
  32150: "Ryan Park's apartment, main room",
  32160: "Ryan Park's apartment, bathroom",
  32170: "Isabella Rodriguez's apartment, main room",
  32180: "Isabella Rodriguez's apartment, bathroom",
  32190: "Giorgio Rossi's apartment, main room",
  32200: "Giorgio Rossi's apartment, bathroom",
  32141: "Carlos Gomez's apartment, main room",
  32151: "Carlos Gomez's apartment, bathroom",
  32161: "The Rose and Crown Pub, pub",
  32171: "Hobbs Cafe, cafe",
  32181: "Oak Hill College, classroom",
  32191: "Oak Hill College, library",
  32201: "Oak Hill College, hallway",
  32142: "Johnson Park, park",
  32152: "Harvey Oak Supply Store, supply store",
  32162: "The Willows Market and Pharmacy, store",
  32193: "Adam Smith's house, main room",
  32203: "Adam Smith's house, bathroom",
  32174: "Yuriko Yamamoto's house, main room",
  32184: "Yuriko Yamamoto's house, bathroom",
  32194: "Moore family's house, main room",
  32204: "Moore family's house, bathroom",
  32172: "Dorm for Oak Hill College, Klaus Mueller's room",
  32182: "Dorm for Oak Hill College, Maria Lopez's room",
  32192: "Dorm for Oak Hill College, Ayesha Khan's room",
  32202: "Dorm for Oak Hill College, Wolfgang Schulz's room",
  32143: "Dorm for Oak Hill College, man's bathroom",
  32153: "Dorm for Oak Hill College, woman's bathroom",
  32163: "Dorm for Oak Hill College, common room",
  32173: "Dorm for Oak Hill College, kitchen",
  32183: "Dorm for Oak Hill College, garden",
  32205: "Tamara Taylor and Carmen Ortiz's house, Tamara Taylor's room",
  32215: "Tamara Taylor and Carmen Ortiz's house, Carmen Ortiz's room",
  32225: "Tamara Taylor and Carmen Ortiz's house, common room",
  32235: "Tamara Taylor and Carmen Ortiz's house, kitchen",
  32245: "Tamara Taylor and Carmen Ortiz's house, bathroom",
  32255: "Tamara Taylor and Carmen Ortiz's house, garden",
  32265: "Moreno family's house, Tom and Jane Moreno's bedroom",
  32275: "Moreno family's house, empty bedroom",
  32206: "Moreno family's house, common room",
  32216: "Moreno family's house, kitchen",
  32226: "Moreno family's house, bathroom",
  32236: "Moreno family's house, garden",
  32246: "Lin family's house, Mei and John Lin's bedroom",
  32256: "Lin family's house, Eddy Lin's bedroom",
  32266: "Lin family's house, common room",
  32276: "Lin family's house, kitchen",
  32207: "Lin family's house, bathroom",
  32217: "Lin family's house, garden"
}

export const GAME_OBJECT_DICT = {
  32227: "bed",
  32237: "desk",
  32247: "closet",
  32257: "shelf",
  32267: "easel",
  32277: "bathroom sink",
  32208: "shower",
  32218: "toilet",
  32228: "kitchen sink",
  32238: "refrigerator",
  32248: "toaster",
  32258: "cooking area",
  32268: "common room table",
  32278: "common room sofa",
  32209: "guitar",
  32219: "microphone",
  32229: "bar customer seating",
  32239: "behind the bar counter",
  32249: "behind the cafe counter",
  32259: "cafe customer seating",
  32269: "piano",
  32279: "blackboard",
  32210: "game console",
  32220: "computer desk",
  32230: "computer",
  32240: "library sofa",
  32250: "bookshelf",
  32260: "library table",
  32270: "classroom student seating",
  32280: "classroom podium",
  32211: "behind the pharmacy counter",
  32221: "behind the grocery counter",
  32231: "pharmacy store shelf",
  32241: "grocery store shelf",
  32251: "pharmacy store counter",
  32261: "grocery store counter",
  32271: "supply store product shelf",
  32281: "behind the supply store counter",
  32212: "supply store counter",
  32222: "dorm garden",
  32232: "house garden",
  32242: "garden chair",
  32252: "park garden",
  32262: "harp",
  32272: "lifting weight",
  32282: "pool table"
}
export default class Maze {

  sectorJsonAreas: TilemapLayer
  objectInterAreas: TilemapLayer
  arenaBlockAreas: TilemapLayer
  collisionLayer: TilemapLayer
  spawnJsonAreas: TilemapLayer
  wallLayer: Phaser.Tilemaps.TilemapLayer;

  constructor() {

  }

  initMap(scene: DevScene, mazeName: string) {
    // ----------------
    // MAP AND TILESET
    const map = scene.make.tilemap({key: mazeName});
    console.log(map)
    // const tileset = scene.map.addTilesetImage("tileset", "TilesetImage");
    // With added margin and spacing for the extruded image:
    // const tileset = map.addTilesetImage("tileset", "TilesetImage", 32, 32, 1, 2);

    const collisions = map.addTilesetImage("blocks", "blocks_1");
    const walls = map.addTilesetImage("Room_Builder_32x32", "walls");
    const interiors_pt1 = map.addTilesetImage("interiors_pt1", "interiors_pt1");
    const interiors_pt2 = map.addTilesetImage("interiors_pt2", "interiors_pt2");
    const interiors_pt3 = map.addTilesetImage("interiors_pt3", "interiors_pt3");
    const interiors_pt4 = map.addTilesetImage("interiors_pt4", "interiors_pt4");
    const interiors_pt5 = map.addTilesetImage("interiors_pt5", "interiors_pt5");
    const CuteRPG_Field_B = map.addTilesetImage("CuteRPG_Field_B", "CuteRPG_Field_B");
    const CuteRPG_Field_C = map.addTilesetImage("CuteRPG_Field_C", "CuteRPG_Field_C");
    const CuteRPG_Harbor_C = map.addTilesetImage("CuteRPG_Harbor_C", "CuteRPG_Harbor_C");
    const CuteRPG_Village_B = map.addTilesetImage("CuteRPG_Village_B", "CuteRPG_Village_B");
    const CuteRPG_Forest_B = map.addTilesetImage("CuteRPG_Forest_B", "CuteRPG_Forest_B");
    const CuteRPG_Desert_C = map.addTilesetImage("CuteRPG_Desert_C", "CuteRPG_Desert_C");
    const CuteRPG_Mountains_B = map.addTilesetImage("CuteRPG_Mountains_B", "CuteRPG_Mountains_B");
    const CuteRPG_Desert_B = map.addTilesetImage("CuteRPG_Desert_B", "CuteRPG_Desert_B");
    const CuteRPG_Forest_C = map.addTilesetImage("CuteRPG_Forest_C", "CuteRPG_Forest_C");

    // The first parameter is the layer name (or index) taken from Tiled, the
    // second parameter is the tileset you set above, and the final two
    // parameters are the x, y coordinate.
    // Joon: The "layer name" that comes as the first parameter value
    //       literally is taken from our Tiled layer name. So to find out what
    //       they are; you actually need to open up tiled and see how you
    //       named things there.
    let tileset_group_1 = [CuteRPG_Field_B, CuteRPG_Field_C, CuteRPG_Harbor_C, CuteRPG_Village_B,
      CuteRPG_Forest_B, CuteRPG_Desert_C, CuteRPG_Mountains_B, CuteRPG_Desert_B, CuteRPG_Forest_C,
      interiors_pt1, interiors_pt2, interiors_pt3, interiors_pt4, interiors_pt5, walls];
    const bottomGroundLayer = map.createLayer("Bottom Ground", tileset_group_1, 0, 0);
    const exteriorGroundLayer = map.createLayer("Exterior Ground", tileset_group_1, 0, 0);
    const exteriorDecorationL1Layer = map.createLayer("Exterior Decoration L1", tileset_group_1, 0, 0);
    const exteriorDecorationL2Layer = map.createLayer("Exterior Decoration L2", tileset_group_1, 0, 0);
    const interiorGroundLayer = map.createLayer("Interior Ground", tileset_group_1, 0, 0);
    this.wallLayer = map.createLayer("Wall", [CuteRPG_Field_C, walls], 0, 0);
    const interiorFurnitureL1Layer = map.createLayer("Interior Furniture L1", tileset_group_1, 0, 0);
    const interiorFurnitureL2Layer = map.createLayer("Interior Furniture L2 ", tileset_group_1, 0, 0);
    const foregroundL1Layer = map.createLayer("Foreground L1", tileset_group_1, 0, 0);
    const foregroundL2Layer = map.createLayer("Foreground L2", tileset_group_1, 0, 0);

    this.spawnJsonAreas = map.createLayer("Spawning Blocks", tileset_group_1, 0, 0);
    // this.spawnJsonAreas = this.calculateWalkableTiles("mesh", map, [this.SpawningBlocks]);
    // this.spawnArrayInfo = this.calculateWalkableTilesInfo(SPAWNING_LOCATION_BLOCKS, map, [this.SpawningBlocks]);

    this.sectorJsonAreas = map.createLayer("Sector Blocks", tileset_group_1, 0, 0);

    this.objectInterAreas = map.createLayer("Object Interaction Blocks", tileset_group_1, 0, 0);
    // this.objectInterAreas = this.calculateWalkableTiles("mesh", map, [blocks]);
    // this.objectInterInfo = this.calculateWalkableTilesInfo(GAME_OBJECT_DICT, map, [blocks]);

    this.arenaBlockAreas = map.createLayer("Arena Blocks", tileset_group_1, 0, 0);
    // this.arenaBlockAreas = this.calculateWalkableTiles("mesh", map, [blocks]);
    // this.arenaBlockInfo = this.calculateWalkableTilesInfo(ARENA_BLOCKS_DICT, map, [blocks]);

    this.collisionLayer = map.createLayer("Collisions", collisions, 0, 0);
    // const groundLayer = map.createLayer("Ground", walls, 0, 0);
    // const indoorGroundLayer = map.createLayer("Indoor Ground", walls, 0, 0);
    // const wallsLayer = map.createLayer("Walls", walls, 0, 0);
    // const interiorsLayer = map.createLayer("Furnitures", interiors, 0, 0);
    // const builtInLayer = map.createLayer("Built-ins", interiors, 0, 0);
    // const appliancesLayer = map.createLayer("Appliances", interiors, 0, 0);
    // const foregroundLayer = map.createLayer("Foreground", interiors, 0, 0);

    // Joon : This is where you want to create a custom field for the tileset
    //        in Tiled. Take a look at this guy's tutorial:
    //        https://www.youtube.com/watch?v=MR2CvWxOEsw&ab_channel=MattWilber
    this.collisionLayer.setCollisionByProperty({collide: true});
    this.wallLayer.setCollisionByProperty({collide: true});

    // By default, everything gets depth sorted on the screen in the order we
    // created things. Here, we want the "Above Player" layer to sit on top of
    // the player, so we explicitly give it a depth. Higher depths will sit on
    // top of lower depth objects.
    // Collisions layer should get a negative depth since we do not want to see
    // it.
    this.collisionLayer.setDepth(-1);
    foregroundL1Layer.setDepth(2);
    foregroundL2Layer.setDepth(2);
    // Or, you can build one from your tilemap automatically:
    // console.log(collisionsLayer)

    /* handle for Collision layer*/
    scene.navMesh = scene.navMeshPlugin.buildMeshFromTilemap("mesh", map, [this.collisionLayer, this.wallLayer]);
    // scene.navMesh.enableDebug(); // Creates a Phaser.Graphics overlay on top of the screen
    // scene.navMesh.debugDrawClear(); // Clears the overlay
    // scene.navMesh.debugDrawMesh({
    //   drawCentroid: true,
    //   drawBounds: false,
    //   drawNeighbors: true,
    //   drawPortals: true
    // });
    // scene.navMesh.debugDrawPath(path, 0xffd900);

    // this.LayerToCollide = collisionsLayer;
    // this.LayerToCollide.setVisible(false);  // Comment out this line if you wish to see which objects the player will collide with

    // ----------------
    // PLAYER
    // Get the spawn point
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    // const mousePoint = map.findObject("Objects", obj => obj.name === "Mouse Point");
    const pos = getStore("player_pos", spawnPoint);
    // Create the player and the player animations (see player.js)
    //scene.player = scene.add.player(pos.x, pos.y, "atlas", "ariel-front")
    scene.player = new Player(scene, pos.x, pos.y);

    scene.physics.world.collide(scene.player, this.wallLayer);
    scene.physics.world.collide(scene.player, this.collisionLayer);

    // scene.player.setDepth(1);
    // scene.player.inputEnabled = true;
    // https://newdocs.phaser.io/docs/3.55.2/Phaser.Input.Events.GAMEOBJECT_POINTER_OVER
    // this.player.setInteractive({useHandCursor: true}).on('pointerover', () => console.error("pointerover"))
    // this.player.setInteractive({useHandCursor: true}).on('pointerout', () => console.error("pointerout"))
    // this.text = this.add.text(this.player.x, this.player.y, 'Move the mouse', { font: '16px Courier', fill: '#1b1919' });


    // Resize the world and camera bounds
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // console.log(scene.physics.world.bounds)
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    scene.cameras.main.startFollow(scene.player, true);
  }

  getNearbyTiles(scene, tile, visionR) {
    // Given the current tile and visionR, return a list of tiles that are
    // within the radius. Note that this implementation looks at a square
    // boundary when determining what is within the radius.
    // i.e., for visionR, returns x's.
    // x x x x x
    // x x x x x
    // x x P x x
    // x x x x x
    // x x x x x

    // INPUT:
    //   tile: The tile coordinate of our interest in (x, y) form.
    //   visionR: The radius of the persona's vision.
    // OUTPUT:
    //   nearbyTiles: a list of tiles that are within the radius.

    let leftEnd = 0;
    if (tile[0] - visionR > leftEnd) {
      leftEnd = tile[0] - visionR;
    }

    let rightEnd = MAZE_WIDTH - 1;
    if (tile[0] + visionR + 1 < rightEnd) {
      rightEnd = tile[0] + visionR + 1;
    }

    let bottomEnd = MAZE_HEIGHT - 1;
    if (tile[1] + visionR + 1 < bottomEnd) {
      bottomEnd = tile[1] + visionR + 1;
    }

    let topEnd = 0;
    if (tile[1] - visionR > topEnd) {
      topEnd = tile[1] - visionR;
    }

    const nearbyTiles = [];
    for (let i = leftEnd; i < rightEnd; i++) {
      for (let j = topEnd; j < bottomEnd; j++) {
        nearbyTiles.push([i, j]);
      }
    }
    return nearbyTiles;
  }

  calculateWalkableTiles(tilemap, mapData, tilesets, isWalkableFn = undefined) {
    let walkableTiles = [];

    const layersToCheck = tilesets ? tilesets.map(tileset => tileset.layer) : mapData.layers;

    // Set the walkable function if not provided
    if (!isWalkableFn) {
      isWalkableFn = tile => !tile.collides;
    }

    // Check each tile for walkability
    for (let y = 0; y < mapData.height; y++) {
      const row = [];
      for (let x = 0; x < mapData.width; x++) {
        let isWalkable = true;
        for (const layer of layersToCheck) {
          const tileData = layer.data[y][x];
          if (tileData && tileData.index !== -1 && !isWalkableFn(tileData)) {
            isWalkable = false;
            walkableTiles.push(`${tileData.x},${tileData.y}`);
            break;
          }
        }
        row.push(isWalkable);
      }
      walkableTiles.push(row);
    }

    return walkableTiles;
  }

  calculateWalkableTilesInfo(tilemapData, tileset, tileLayers, collisionFilter = 0) {
    const infoJson = tilemapData;
    const walkableTiles = [];

    // Get layers to consider
    const layersToCheck = tileLayers ? tileLayers.map(layer => layer.layer) : tileset.layers;

    // Iterate through tilemap to find walkable tiles
    for (let y = 0; y < tilemapData.height; y++) {
      const row = [];
      for (let x = 0; x < tilemapData.width; x++) {
        let isWalkable = true;
        for (const layer of layersToCheck) {
          const tileData = layer.data[y][x];
          if (tileData && tileData.index !== -1) {
            isWalkable = false;
            walkableTiles.push(infoJson[tileData.index]);
            break;
          }
        }
        row.push(isWalkable);
      }
    }

    // Return list of walkable tiles
    return walkableTiles;
  }


  getBodyEdgeCoordinate(tmpMoveX, tmpMoveY, displayWidth = 32, displayHeight = 32, layer = this.collisionLayer, tileSize = 32) {
    // 获取玩家左上角和右下角的坐标
    const playerLeft = tmpMoveX;
    const playerRight = tmpMoveX + displayWidth;
    const playerTop = tmpMoveY;
    const playerBottom = tmpMoveY + displayHeight;

    // 获取玩家左上角所在的Tile块的行列索引
    const playerTileX = Math.floor(tmpMoveX / tileSize);
    const playerTileY = Math.floor(tmpMoveY / tileSize);

    const playerTileRightX = Math.floor(playerRight / tileSize);
    const playerTileRightY = Math.floor(playerBottom / tileSize);

    return [{x: playerTileX, y:playerTileY}, {x: playerTileRightX, y:playerTileRightY}]
  }

  getPositionDesc(x, y, isTile = false, level = 0) {
    /* sector（家） > Atena（房间） > Obj（家具） | spawn(睡觉的地方） */
    const positions = isTile ? [{x: x, y:y}] : this.getBodyEdgeCoordinate(x, y)
    const sectorDesc = this.getTileInfo(positions, this.sectorJsonAreas, SECTOR_DICT)
    if (sectorDesc === "") {
      return DEFAULT_POSITION
    }

    if (level === 1) {
      return sectorDesc
    }

    const arenaDesc = this.getTileInfo(positions, this.arenaBlockAreas, ARENA_BLOCKS_DICT)
    if (arenaDesc === "") {
      return sectorDesc
    }

    const isPlayerHouse = this.isPlayerHouse(sectorDesc)
    if (level === 2) {
      return this.handleDesc(arenaDesc, isPlayerHouse)
    }

    const objectDesc = this.getTileInfo(positions, this.objectInterAreas, GAME_OBJECT_DICT)
    if (objectDesc === "") {
      return this.handleDesc(arenaDesc, isPlayerHouse)
    }
    return this.handleDesc(arenaDesc + ", " + objectDesc, isPlayerHouse)
  }

  getTileInfo(positions, tilemapLayer: TilemapLayer, infoArr) {
    for (const pos of positions) {
      let {x, y} = pos
      const tile = tilemapLayer.getTileAt(x, y)
      if(tile && tile.index != -1){
        return infoArr[tile.index]
      }
    }
    return ""
  }

  isPlayerHouse(sectorDesc) {
    return sectorDesc.indexOf("You family") !== -1
  }

  handleDesc(info, isPlayerHouse) {
    if (isPlayerHouse) {
      // https://github.com/joonspk-research/generative_agents/blob/main/environment/frontend_server/static_dirs/assets/the_ville/matrix/special_blocks/sector_blocks.csv
      return info
        .replaceAll("Eddy Lin", "secondary")
        .replaceAll("Mei and John Lin", "You")
        .replaceAll("Bob", "You")
        .replaceAll("Lin", "You")
    }
    return info
  }

  isCollision(tmpMoveX, tmpMoveY, displayWidth = 32, displayHeight = 32, layer = this.collisionLayer, tileSize = 32) {
    const positions = this.getBodyEdgeCoordinate(tmpMoveX, tmpMoveY, displayWidth, displayHeight, layer, tileSize)
    for (const pos of positions) {
      const {x, y} = pos;
      const tile = layer.getTileAt(x, y)
      if (tile && tile.index != -1){
        // console.log('Player is colliding with collision layer!' + x + " " + y + " index: " + tile.index);
        return true
      }
    }
    return false
  }

  public preloadNpcSprites(scene: DevScene) {
    scene.personas = {};
    for (const name in NPC_PREDEFINED) {
      let start_pos = [NPC_PREDEFINED[name][0] * TIELD_WIDTH + TIELD_WIDTH / 2, NPC_PREDEFINED[name][1] * TIELD_WIDTH + TIELD_WIDTH];
      scene.personas[name] = new Npc(scene, name, start_pos[0], start_pos[1]);
    }
  }
}
