"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";

export type BuildingModel =
  "wall" | "wall-window-wide-square" | "wall-doorway-wide-square" | "floor" | "roof-flat-square";

type Props = {
  model: BuildingModel;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export function BuildingModule({
  model,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: Props) {
  const { scene } = useGLTF(`/models/building-kit/${model}.glb`);
  const instance = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={instance} position={position} rotation={rotation} scale={scale} />;
}
