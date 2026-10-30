const lightRows = [-7.4, -2.6, 2.2];
const lightColumns = [-6, 0, 6];

export function CeilingLedLights() {
  return (
    <group>
      {lightRows.flatMap((z) =>
        lightColumns.map((x) => (
          <group key={`ceiling-led-${x}-${z}`} position={[x, 3.96, z]}>
            <mesh castShadow>
              <boxGeometry args={[2.05, 0.075, 0.25]} />
              <meshStandardMaterial color="#e8e2d2" roughness={0.52} metalness={0.12} />
            </mesh>
            <mesh position={[0, -0.043, 0]}>
              <boxGeometry args={[1.82, 0.018, 0.095]} />
              <meshStandardMaterial
                color="#fff5d8"
                emissive="#ffe5a8"
                emissiveIntensity={2.2}
                roughness={0.3}
                toneMapped={false}
              />
            </mesh>
            {x === 0 && (
              <pointLight
                position={[0, -0.16, 0]}
                color="#ffe8bd"
                intensity={0.5}
                distance={8}
                decay={2}
              />
            )}
          </group>
        )),
      )}
    </group>
  );
}
