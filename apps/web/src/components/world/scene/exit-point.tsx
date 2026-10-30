import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, type Group, type Mesh, type MeshBasicMaterial } from "three";

export function ExitPoint() {
  const orbitRings = useRef<Group>(null);
  const beaconBeam = useRef<Mesh>(null);
  const beamMaterial = useRef<MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (orbitRings.current) orbitRings.current.rotation.y = time * 0.55;
    if (beaconBeam.current) {
      const pulse = 1 + Math.sin(time * 2.2) * 0.035;
      beaconBeam.current.scale.set(pulse, pulse, pulse);
    }
    if (beamMaterial.current) {
      beamMaterial.current.opacity = 0.08 + (Math.sin(time * 2.2) + 1) * 0.025;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 5.3]}>
        <circleGeometry args={[0.78, 40]} />
        <meshBasicMaterial color="#75d5b0" transparent opacity={0.12} side={DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 5.3]}>
        <torusGeometry args={[0.67, 0.045, 8, 40]} />
        <meshBasicMaterial color="#8dffdc" toneMapped={false} />
      </mesh>

      <mesh ref={beaconBeam} position={[0, 1.12, 5.3]}>
        <cylinderGeometry args={[0.24, 0.58, 2.08, 20, 1, true]} />
        <meshBasicMaterial
          ref={beamMaterial}
          color="#75d5b0"
          transparent
          opacity={0.1}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <group ref={orbitRings} position={[0, 1.12, 5.3]}>
        <mesh>
          <torusGeometry args={[0.72, 0.035, 8, 40]} />
          <meshBasicMaterial color="#a2ffe3" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.025, 8, 40]} />
          <meshBasicMaterial color="#4fc9a6" toneMapped={false} />
        </mesh>
      </group>

      {[
        [-0.58, 0.18, 5.3],
        [0.58, 0.18, 5.3],
        [0, 0.18, 4.72],
        [0, 0.18, 5.88],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshBasicMaterial color="#c5ffe9" toneMapped={false} />
        </mesh>
      ))}

      <Text
        position={[0, 2.34, 5.3]}
        rotation={[0, 2 * Math.PI, 0]}
        scale={[-1, 1, 1]}
        fontSize={0.3}
        fontWeight={800}
        letterSpacing={0.16}
        anchorX="center"
        anchorY="middle"
        color="#c5ffe9"
        outlineWidth={0.018}
        outlineColor="#173b3a"
      >
        EXIT
      </Text>
      <Text
        position={[0, 2.07, 5.3]}
        rotation={[0, 2 * Math.PI, 0]}
        scale={[-1, 1, 1]}
        fontSize={0.11}
        fontWeight={700}
        letterSpacing={0.1}
        anchorX="center"
        anchorY="middle"
        color="#8be2c2"
      >
        RETURN HOME
      </Text>
      <pointLight position={[0, 0.5, 5.3]} color="#75d5b0" intensity={1.8} distance={3.2} />
    </group>
  );
}
