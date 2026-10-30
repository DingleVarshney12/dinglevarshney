const codeLines = [
  { x: -0.36, y: 0.25, width: 0.34, color: "#e6c17a" },
  { x: -0.28, y: 0.17, width: 0.59, color: "#a8d9c6" },
  { x: -0.28, y: 0.09, width: 0.44, color: "#8db6d0" },
  { x: -0.22, y: 0.01, width: 0.67, color: "#a8d9c6" },
  { x: -0.22, y: -0.07, width: 0.5, color: "#d9a78f" },
  { x: -0.28, y: -0.15, width: 0.62, color: "#a8d9c6" },
];

export function MonitorCode() {
  return (
    <group position={[0, 2.08, -5.235]} rotation={[-0.08, 0, 0]}>
      {codeLines.map((line, index) => (
        <mesh key={index} position={[line.x + line.width / 2, line.y, 0]}>
          <boxGeometry args={[line.width, 0.018, 0.008]} />
          <meshBasicMaterial color={line.color} />
        </mesh>
      ))}
      <mesh position={[-0.38, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.03, 0.008]} />
        <meshBasicMaterial color="#e69b77" />
      </mesh>
    </group>
  );
}
