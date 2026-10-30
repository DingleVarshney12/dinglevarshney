import { isWorldObjectBlocking } from "./collision";

const GRID_STEP = 0.35;
const MIN_X = -8.7;
const MIN_Z = -9.7;
const MAX_X = 8.7;
const MAX_Z = 5.8;
const COLUMNS = Math.round((MAX_X - MIN_X) / GRID_STEP) + 1;
const ROWS = Math.round((MAX_Z - MIN_Z) / GRID_STEP) + 1;

type Cell = { x: number; z: number };

function keyOf(cell: Cell) {
  return cell.z * COLUMNS + cell.x;
}
function worldPosition(cell: Cell): [number, number] {
  return [MIN_X + cell.x * GRID_STEP, MIN_Z + cell.z * GRID_STEP];
}
function toCell(x: number, z: number): Cell {
  return {
    x: Math.max(0, Math.min(COLUMNS - 1, Math.round((x - MIN_X) / GRID_STEP))),
    z: Math.max(0, Math.min(ROWS - 1, Math.round((z - MIN_Z) / GRID_STEP))),
  };
}

export function findWorldPath(
  startX: number,
  startZ: number,
  targetX: number,
  targetZ: number,
): [number, number][] {
  const start = toCell(startX, startZ);
  const goal = toCell(targetX, targetZ);
  const startKey = keyOf(start);
  const goalKey = keyOf(goal);
  const parents = new Map<number, number>();
  const queue = [start];
  parents.set(startKey, -1);
  const directions: Cell[] = [
    { x: 1, z: 0 },
    { x: -1, z: 0 },
    { x: 0, z: 1 },
    { x: 0, z: -1 },
  ];

  for (let cursor = 0; cursor < queue.length && !parents.has(goalKey); cursor += 1) {
    const current = queue[cursor];
    for (const direction of directions) {
      const next = { x: current.x + direction.x, z: current.z + direction.z };
      if (next.x < 0 || next.x >= COLUMNS || next.z < 0 || next.z >= ROWS) continue;
      const nextKey = keyOf(next);
      if (parents.has(nextKey)) continue;
      const [x, z] = worldPosition(next);
      if (nextKey !== goalKey && isWorldObjectBlocking(x, z)) continue;
      parents.set(nextKey, keyOf(current));
      queue.push(next);
    }
  }

  if (!parents.has(goalKey)) return [[targetX, targetZ]];

  const cells: Cell[] = [];
  let key = goalKey;
  while (key !== -1) {
    cells.push({ x: key % COLUMNS, z: Math.floor(key / COLUMNS) });
    key = parents.get(key) ?? -1;
  }
  cells.reverse();

  const corners: Cell[] = [cells[0]];
  for (let index = 1; index < cells.length - 1; index += 1) {
    const before = cells[index - 1];
    const current = cells[index];
    const after = cells[index + 1];
    if (
      current.x - before.x !== after.x - current.x ||
      current.z - before.z !== after.z - current.z
    ) {
      corners.push(current);
    }
  }
  if (cells.length > 1) corners.push(cells[cells.length - 1]);

  const points = corners.slice(1).map(worldPosition);
  const last = points[points.length - 1];
  if (!last || Math.hypot(last[0] - targetX, last[1] - targetZ) > GRID_STEP * 0.35)
    points.push([targetX, targetZ]);
  return points;
}
