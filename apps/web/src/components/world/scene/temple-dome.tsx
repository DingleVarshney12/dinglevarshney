export function TempleDome() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 1.4, 0.06]} scale={[1.27, 0.54, 0.34]}>
        <sphereGeometry args={[1, 16, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#bd8b6b" roughness={0.8} flatShading />
      </mesh>

      <mesh castShadow position={[0, 1.4, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.075, 6, 16]} />
        <meshStandardMaterial color="#d2a27d" roughness={0.74} flatShading />
      </mesh>

      <mesh castShadow position={[0, 1.91, 0.06]}>
        <cylinderGeometry args={[0.11, 0.16, 0.08, 8]} />
        <meshStandardMaterial color="#d0a06a" roughness={0.68} flatShading />
      </mesh>
      <mesh castShadow position={[0, 2.0, 0.06]}>
        <sphereGeometry args={[0.075, 8, 6]} />
        <meshStandardMaterial color="#e1b66f" roughness={0.62} flatShading />
      </mesh>
      <mesh castShadow position={[0, 2.08, 0.06]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color="#d0a06a" roughness={0.64} flatShading />
      </mesh>
    </group>
  );
}
