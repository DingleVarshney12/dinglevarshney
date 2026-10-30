import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "three";

type Props = {
  position: Vector3Tuple;
  index: number;
};

export function CertificateFrame({ position, index }: Props) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.18, 1.42, 0.16]} />
        <meshStandardMaterial color="#765536" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[2.04, 1.28, 0.04]} />
        <meshStandardMaterial color="#d1b77f" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0, 0.116]}>
        <boxGeometry args={[1.9, 1.14, 0.018]} />
        <meshStandardMaterial color="#f5edda" roughness={0.94} />
      </mesh>

      <Text
        position={[0, 0.39, 0.13]}
        fontSize={0.13}
        fontWeight={700}
        letterSpacing={0.06}
        anchorX="center"
        anchorY="middle"
        color="#755c35"
      >
        CERTIFICATE
      </Text>
      <Text
        position={[0, 0.25, 0.13]}
        fontSize={0.075}
        letterSpacing={0.1}
        anchorX="center"
        anchorY="middle"
        color="#a48b5d"
      >
        OF ACHIEVEMENT
      </Text>
      <mesh position={[0, 0.15, 0.13]}>
        <boxGeometry args={[0.55, 0.012, 0.008]} />
        <meshBasicMaterial color="#c6a960" />
      </mesh>
      <Text
        position={[-0.19, 0.015, 0.13]}
        fontSize={0.085}
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        color="#655941"
      >
        DINGLE VARSHNEY
      </Text>
      <Text
        position={[-0.19, -0.115, 0.13]}
        fontSize={0.062}
        anchorX="center"
        anchorY="middle"
        color="#94866e"
      >
        has successfully completed
      </Text>
      <mesh position={[-0.2, -0.29, 0.13]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.48, 0.012, 0.008]} />
        <meshBasicMaterial color="#9a8762" />
      </mesh>
      <mesh position={[-0.2, -0.37, 0.13]}>
        <boxGeometry args={[0.3, 0.009, 0.008]} />
        <meshBasicMaterial color="#b3a486" />
      </mesh>

      <mesh position={[0.62, -0.12, 0.14]}>
        <circleGeometry args={[0.16, 16]} />
        <meshBasicMaterial color="#c7a75f" />
      </mesh>
      <mesh position={[0.62, -0.12, 0.15]}>
        <circleGeometry args={[0.115, 16]} />
        <meshBasicMaterial color="#f1dfaa" />
      </mesh>
      <mesh position={[0.55, -0.39, 0.135]} rotation={[0, 0, 0.12]}>
        <coneGeometry args={[0.075, 0.3, 4]} />
        <meshStandardMaterial color="#a56b50" roughness={0.8} />
      </mesh>
      <mesh position={[0.69, -0.39, 0.135]} rotation={[0, 0, -0.12]}>
        <coneGeometry args={[0.075, 0.3, 4]} />
        <meshStandardMaterial color="#a56b50" roughness={0.8} />
      </mesh>
      <Text
        position={[-0.82, -0.54, 0.13]}
        fontSize={0.06}
        anchorX="left"
        anchorY="middle"
        color="#9c8a69"
      >
        No. {String(index).padStart(2, "0")}
      </Text>
    </group>
  );
}
