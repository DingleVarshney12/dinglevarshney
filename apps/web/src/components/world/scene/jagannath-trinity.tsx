import { Capsule, Cylinder } from "@react-three/drei";

type DeityProps = {
  x: number;
  skin: string;
  crown: string;
  eyeRing: string;
  sash: string;
  scale: number;
};

function DeityFigure({ x, skin, crown, eyeRing, sash, scale }: DeityProps) {
  return (
    <group position={[x, 0, 0]} scale={scale}>
      <Cylinder args={[0.3, 0.36, 0.55, 8]} position={[0, 0.33, 0]} castShadow>
        <meshStandardMaterial color={skin} flatShading roughness={0.78} />
      </Cylinder>
      <mesh castShadow position={[0, 0.7, 0]}>
        <torusGeometry args={[0.28, 0.075, 5, 10]} />
        <meshStandardMaterial color={crown} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.53, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.29, 0.055, 5, 10]} />
        <meshStandardMaterial color={sash} flatShading />
      </mesh>
      <Cylinder args={[0.14, 0.17, 0.12, 8]} position={[0, 0.04, 0]} castShadow>
        <meshStandardMaterial color={crown} flatShading />
      </Cylinder>

      <mesh castShadow position={[0, 1.02, 0]}>
        <boxGeometry args={[0.76, 0.67, 0.36]} />
        <meshStandardMaterial color={skin} flatShading roughness={0.68} />
      </mesh>
      <mesh castShadow position={[0, 1.38, 0.02]}>
        <cylinderGeometry args={[0.16, 0.28, 0.3, 7]} />
        <meshStandardMaterial color={crown} flatShading />
      </mesh>
      {[-0.205, 0.205].map((eyeX) => (
        <group key={eyeX} position={[eyeX, 1.04, 0.187]}>
          <mesh>
            <circleGeometry args={[0.16, 12]} />
            <meshStandardMaterial color={eyeRing} />
          </mesh>
          <mesh position={[0, 0, 0.008]}>
            <circleGeometry args={[0.128, 12]} />
            <meshStandardMaterial color="#fff7e8" />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <circleGeometry args={[0.078, 12]} />
            <meshStandardMaterial color="#151b22" />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <circleGeometry args={[0.03, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.79, 0.195]}>
        <boxGeometry args={[0.24, 0.045, 0.02]} />
        <meshStandardMaterial color={eyeRing} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <Capsule
            args={[0.085, 0.34, 3, 6]}
            position={[side * 0.43, 0.53, 0]}
            rotation={[0, 0, (side * Math.PI) / 2]}
            castShadow
          >
            <meshStandardMaterial color={skin} flatShading />
          </Capsule>
          <mesh castShadow position={[side * 0.7, 0.53, 0]}>
            <sphereGeometry args={[0.11, 7, 5]} />
            <meshStandardMaterial color={sash} flatShading />
          </mesh>
        </group>
      ))}
      {[-0.12, 0, 0.12].map((beadX, index) => (
        <mesh key={beadX} position={[beadX, 0.36 - Math.abs(beadX), 0.31]}>
          <sphereGeometry args={[0.045, 6, 5]} />
          <meshStandardMaterial color={index === 1 ? "#fff0b6" : crown} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function JagannathTrinity() {
  return (
    <group position={[0, -0.7, 0.03]}>
      <DeityFigure
        x={-0.44}
        skin="#f5e5c8"
        crown="#e4a52d"
        eyeRing="#d84738"
        sash="#2366a0"
        scale={0.62}
      />
      <DeityFigure
        x={0}
        skin="#f3bd35"
        crown="#e28b22"
        eyeRing="#d44332"
        sash="#2d9858"
        scale={0.52}
      />
      <DeityFigure
        x={0.44}
        skin="#17232c"
        crown="#d94b3d"
        eyeRing="#e34a42"
        sash="#dda72e"
        scale={0.62}
      />
    </group>
  );
}
