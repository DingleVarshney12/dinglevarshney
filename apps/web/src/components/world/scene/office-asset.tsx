"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

export type OfficeAssetName =
  | "office_desk"
  | "office_chair"
  | "monitor"
  | "desktop_tower"
  | "keyboard"
  | "computer_mouse"
  | "bookshelf"
  | "office_plant"
  | "desk_lamp"
  | "coffee_mug"
  | "paper_stack"
  | "headset";

const materialColors: Partial<Record<OfficeAssetName, Record<string, string>>> = {
  office_desk: { desk: "#795638", desk2: "#5c422d" },
  office_chair: { chair: "#243b43", metal: "#40575d", dark: "#17242b" },
  monitor: { screen: "#8cc7b2" },
  desktop_tower: { steel: "#61727a", led: "#5dc6b2" },
  keyboard: { keyb: "#26363b", key: "#d8c7a8" },
  bookshelf: {
    red2: "#a45c45",
    blue: "#6f7f9a",
    green2: "#7e9b84",
    yellow2: "#d8b875",
    orange: "#bf7858",
    paper: "#f5edda",
  },
  office_plant: { pot: "#bf7858", plant: "#59856c", coffee: "#785c43" },
};

type Props = {
  asset: OfficeAssetName;
  position: [number, number, number];
  scale: number | [number, number, number];
  rotation?: [number, number, number];
};

export function OfficeAsset({ asset, position, scale, rotation = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(`/models/office/${asset}.glb`);
  const instance = useMemo(() => {
    const clone = scene.clone(true);
    const overrides = materialColors[asset] ?? {};
    clone.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      const recolor = (material: MeshStandardMaterial) => {
        const copy = material.clone();
        const color = overrides[copy.name];
        if (color) copy.color.set(color);
        if (asset === "desktop_tower" && copy.name === "led") {
          copy.emissive.set("#1b695a");
          copy.emissiveIntensity = 0.45;
        }
        if (asset === "monitor" && copy.name === "screen") {
          copy.emissive.set("#27483e");
          copy.emissiveIntensity = 0.3;
        }
        return copy;
      };
      node.material = Array.isArray(node.material)
        ? node.material.map((material) =>
            material instanceof MeshStandardMaterial ? recolor(material) : material,
          )
        : node.material instanceof MeshStandardMaterial
          ? recolor(node.material)
          : node.material;
    });
    return clone;
  }, [asset, scene]);

  return <primitive object={instance} position={position} rotation={rotation} scale={scale} />;
}
