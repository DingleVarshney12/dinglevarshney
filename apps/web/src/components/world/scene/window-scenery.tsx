export function WindowScenery() {
  return (
    <group position={[-4, 0, -11.17]}>
      <mesh position={[0, 2.25, 0]}>
        <planeGeometry args={[2.95, 2.08]} />
        <meshBasicMaterial color="#83c5e9" />
      </mesh>
      <mesh position={[0, 1.48, 0.035]}>
        <planeGeometry args={[2.95, 0.55]} />
        <meshBasicMaterial color="#91b68e" />
      </mesh>
      <mesh position={[-0.7, 1.62, 0.045]}>
        <coneGeometry args={[1, 0.92, 5]} />
        <meshBasicMaterial color="#7b9c7c" />
      </mesh>
      <mesh position={[0.72, 1.62, 0.05]}>
        <coneGeometry args={[0.95, 0.86, 5]} />
        <meshBasicMaterial color="#a3bd8a" />
      </mesh>
      {[-1.06, 1.04].map((x) => (
        <group key={x} position={[x, 1.52, 0.075]}>
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.055, 0.075, 0.5, 6]} />
            <meshBasicMaterial color="#795638" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.34, 0.68, 6]} />
            <meshBasicMaterial color={x < 0 ? "#5f896a" : "#6f9873"} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <coneGeometry args={[0.24, 0.46, 6]} />
            <meshBasicMaterial color="#769f78" />
          </mesh>
        </group>
      ))}
      {[
        [-0.72, 2.72, 0.07],
        [-0.48, 2.8, 0.08],
        [-0.24, 2.72, 0.07],
        [0.54, 2.84, 0.07],
        [0.8, 2.9, 0.08],
        [1.05, 2.82, 0.07],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} scale={[1, 0.58, 0.45]}>
          <sphereGeometry args={[0.22, 8, 6]} />
          <meshBasicMaterial color="#fbfaf2" />
        </mesh>
      ))}
      <mesh position={[0.96, 2.95, 0.025]}>
        <circleGeometry args={[0.16, 12]} />
        <meshBasicMaterial color="#f6d28b" />
      </mesh>
    </group>
  );
}
