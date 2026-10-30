"use client";

import { BuildingModule, type BuildingModel } from "./building-module";
import { WoodenDoor } from "./wooden-door";

const roomWallScale: [number, number, number] = [1, 1.7, 1];
const backWallSections: { x: number; model: BuildingModel }[] = [
  { x: -9, model: "wall" },
  { x: -7, model: "wall" },
  { x: -4, model: "wall-window-wide-square" },
  { x: -1, model: "wall" },
  { x: 1, model: "wall" },
  { x: 3, model: "wall" },
  { x: 5, model: "wall" },
  { x: 7, model: "wall" },
  { x: 9, model: "wall" },
];
const sideWallPositions = [-10, -8, -6, -4, -2, 0, 2, 4, 6];
const sideWallEdges = [-9.86, 9.86] as const;
const frontWallPositions = [-9, -7, -5, -3, 3, 5, 7, 9];
const roofColumns = [-9.6, -7.2, -4.8, -2.4, 0, 2.4, 4.8, 7.2, 9.6];
const roofRows = [-9.8, -7.4, -5, -2.6, -0.2, 2.2, 4.6, 7];

export function RoomShell() {
  return (
    <group>
      {backWallSections.map(({ x, model }) => (
        <BuildingModule
          key={`back-${x}`}
          model={model}
          position={[x, 0.04, -10.9]}
          rotation={[0, Math.PI / 2, 0]}
          scale={roomWallScale}
        />
      ))}
      {sideWallPositions.flatMap((z) =>
        sideWallEdges.map((x) => (
          <BuildingModule
            key={`side-${x}-${z}`}
            model="wall"
            position={[x, 0.04, z]}
            scale={roomWallScale}
          />
        )),
      )}
      {frontWallPositions.map((x) => (
        <BuildingModule
          key={`front-${x}`}
          model="wall"
          position={[x, 0.04, 6.9]}
          rotation={[0, Math.PI / 2, 0]}
          scale={roomWallScale}
        />
      ))}
      <BuildingModule
        model="wall-doorway-wide-square"
        position={[0, 0.04, 6.9]}
        rotation={[0, Math.PI / 2, 0]}
        scale={roomWallScale}
      />
      <WoodenDoor />
      {roofRows.flatMap((z) =>
        roofColumns.map((x) => (
          <BuildingModule key={`roof-${x}-${z}`} model="roof-flat-square" position={[x, 4.12, z]} />
        )),
      )}
      <BuildingModule model="floor" position={[0, -0.005, -2]} scale={[10, 0.4, 9]} />
    </group>
  );
}
