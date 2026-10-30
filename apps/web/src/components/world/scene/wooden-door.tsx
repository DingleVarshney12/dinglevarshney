"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

export function WoodenDoor() {
  const { scene } = useGLTF("/models/building-kit/door-rotate-square-a.glb");
  const door = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      const handle = node.name.toLowerCase().includes("handle");
      const recolor = (material: MeshStandardMaterial) => {
        const copy = material.clone();
        copy.map = null;
        copy.color.set(handle ? "#d8b875" : "#795638");
        copy.roughness = handle ? 0.4 : 0.82;
        copy.metalness = handle ? 0.62 : 0;
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
  }, [scene]);

  return (
    <primitive
      object={door}
      position={[1.45, 0.04, 6.9]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[1, 1.7, 3.22]}
    />
  );
}
