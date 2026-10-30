import { RoundedBox, Text } from "@react-three/drei";

export function AboutBook() {
  return (
    <group position={[8.52, 1.46, -4.78]} rotation={[0, Math.PI * 2, 0]} scale={[2, 1, 1]}>
      <RoundedBox
        args={[0.245, 0.72, 0.105]}
        radius={0.012}
        smoothness={2}
        position={[0, 0, -0.004]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f1e6cc" roughness={0.92} />
      </RoundedBox>
      <RoundedBox
        args={[0.28, 0.78, 0.022]}
        radius={0.018}
        smoothness={2}
        position={[0, 0, 0.064]}
        castShadow
      >
        <meshStandardMaterial color="#6f8d78" roughness={0.78} />
      </RoundedBox>
      <RoundedBox
        args={[0.28, 0.78, 0.022]}
        radius={0.018}
        smoothness={2}
        position={[0, 0, -0.064]}
        castShadow
      >
        <meshStandardMaterial color="#58725f" roughness={0.82} />
      </RoundedBox>
      <RoundedBox
        args={[0.045, 0.78, 0.15]}
        radius={0.018}
        smoothness={2}
        position={[-0.132, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color="#58725f" roughness={0.82} />
      </RoundedBox>
      {[-0.19, -0.13, -0.07, -0.01, 0.05, 0.11, 0.17].map((y) => (
        <mesh key={y} position={[0.126, y, 0]}>
          <boxGeometry args={[0.003, 0.004, 0.075]} />
          <meshBasicMaterial color="#d7c9aa" />
        </mesh>
      ))}
      <Text
        position={[0, 0, 0.078]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.1}
        fontWeight={600}
        letterSpacing={0.025}
        anchorX="center"
        anchorY="middle"
        color="#f5edda"
      >
        ABOUT ME
      </Text>
    </group>
  );
}
