import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";

const flowerColors = ["#ffd16b", "#fff2cf", "#f3a8a1", "#f7c6d0"];
const petalCount = 24;

export function TempleFlowerFall({ trigger }: { trigger: number }) {
  const petals = useRef<Mesh[]>([]);
  const lastTrigger = useRef(trigger);
  const startedAt = useRef(Number.NEGATIVE_INFINITY);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (trigger !== lastTrigger.current) {
      lastTrigger.current = trigger;
      startedAt.current = time;
    }

    const elapsed = time - startedAt.current;
    petals.current.forEach((petal, index) => {
      if (!petal) return;
      const phase = (index % 6) * 0.12;
      const fallTime = elapsed - phase;
      const visible = trigger > 0 && fallTime >= 0 && fallTime < 3.15;
      petal.visible = visible;
      if (!visible) return;

      const speed = 1.08 + (index % 5) * 0.13;
      const seed = index * 1.73;
      petal.position.set(
        Math.sin(seed) * 0.95 + Math.sin(fallTime * 2.4 + seed) * 0.25,
        Math.max(0.08, 3.25 - fallTime * speed),
        Math.cos(seed * 0.8) * 0.9 + Math.cos(fallTime * 1.8 + seed) * 0.2,
      );
      petal.rotation.set(
        fallTime * (1.4 + (index % 3) * 0.35),
        seed + fallTime * 1.2,
        Math.sin(fallTime * 2 + seed) * 0.7,
      );
      (petal.material as MeshStandardMaterial).opacity = Math.min(
        1,
        Math.max(0, (3.15 - fallTime) * 2),
      );
    });
  });

  return (
    <group position={[8.1, 0, 0.15]}>
      {Array.from({ length: petalCount }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) petals.current[index] = mesh;
          }}
          visible={false}
          scale={[0.075, 0.024, 0.13]}
        >
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial
            color={flowerColors[index % flowerColors.length]}
            roughness={0.68}
            flatShading
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}
