import { solidObjects } from "../constants/world.constants";

export function isWorldObjectBlocking(x: number, z: number) {
  const radius = 0.48;
  return solidObjects.some(
    (object) =>
      x > object.minX - radius &&
      x < object.maxX + radius &&
      z > object.minZ - radius &&
      z < object.maxZ + radius,
  );
}
