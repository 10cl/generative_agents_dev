import {DevScene} from "../scenes/dev";

export function get_distance_between(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

export function isCollision(scene: DevScene, tmpMoveX: number, tmpMoveY: number) {
  // return !scene.navMesh.isPointInMesh({x: tmpMoveX + this.displayWidth / 2, y: tmpMoveY + this.displayHeight / 2})
  // console.log("tmpMoveX: " + tmpMoveX + ", tmpMoveY: " + tmpMoveY)
  const collisionLayer = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.collisionLayer)
  const wallCollision = scene.maze.isCollision(tmpMoveX + this.displayWidth / 2, tmpMoveY + this.displayHeight / 2, 0, 0, scene.maze.wallLayer)
  return collisionLayer || wallCollision
}
