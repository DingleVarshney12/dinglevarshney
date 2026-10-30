export function Room() {
  return (
    <>
      <mesh receiveShadow position={[0, -0.24, -2]}>
        <boxGeometry args={[20, 0.45, 18]} />
        <meshStandardMaterial color="#a17d4d" roughness={0.82} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, -2.1]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#718b79" roughness={1} />
      </mesh>
    </>
  );
}
