import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import {
  playerConversationPosition,
  workerConversationPosition,
} from "../constants/world.constants";

export function WorkerMascot({ isTalking = false }: { isTalking?: boolean }) {
  const mascot = useRef<Group>(null);
  const head = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const seatedLegs = useRef<Group>(null);
  const standingLegs = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const standProgress = useRef(0);

  useFrame(({ clock }, delta) => {
    const target = isTalking ? 1 : 0;
    standProgress.current += (target - standProgress.current) * (1 - Math.exp(-delta * 3.8));
    const progress = standProgress.current;
    const facingPlayer = Math.atan2(
      playerConversationPosition[0] - workerConversationPosition[0],
      playerConversationPosition[2] - workerConversationPosition[2],
    );

    if (mascot.current) {
      mascot.current.position.x = workerConversationPosition[0] * progress;
      mascot.current.position.z = -3.82 + (workerConversationPosition[2] + 3.82) * progress;
      mascot.current.rotation.y = Math.PI + (facingPlayer - Math.PI) * progress;
    }
    if (torso.current) torso.current.position.y = 1.08 + progress * 0.2;
    if (head.current) {
      head.current.position.y = 2.23 + progress * 0.2;
      head.current.rotation.y = isTalking ? Math.sin(clock.elapsedTime * 2.2) * 0.08 : 0;
    }
    if (seatedLegs.current) seatedLegs.current.visible = progress < 0.78;
    if (standingLegs.current) {
      standingLegs.current.visible = progress > 0.05;
      standingLegs.current.scale.y = progress;
    }

    const gesture = isTalking ? Math.sin(clock.elapsedTime * 3.4) * 0.16 : 0;
    if (leftArm.current) {
      leftArm.current.position.set(-0.47, 1.26, 0.03 + progress * 0.05);
      leftArm.current.rotation.z = 0.18 + progress * -0.28 + gesture;
    }
    if (rightArm.current) {
      rightArm.current.position.set(0.47, 1.26, 0.03 + progress * 0.05);
      rightArm.current.rotation.z = -0.18 + progress * 0.28 - gesture;
    }
  });

  return (
    <group ref={mascot} position={[0, 0, -3.82]} rotation={[0, Math.PI, 0]}>
      <group ref={head} position={[0, 2.23, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#ffc46f" flatShading />
        </mesh>
        <mesh castShadow position={[-0.36, 0.44, 0]} rotation={[0, 0, 0.18]}>
          <coneGeometry args={[0.18, 0.44, 5]} />
          <meshStandardMaterial color="#f19a59" flatShading />
        </mesh>
        <mesh castShadow position={[0.36, 0.44, 0]} rotation={[0, 0, -0.18]}>
          <coneGeometry args={[0.18, 0.44, 5]} />
          <meshStandardMaterial color="#f19a59" flatShading />
        </mesh>
        {[-0.19, 0.19].map((x) => (
          <group key={x}>
            <mesh position={[x, 0.04, 0.47]}>
              <sphereGeometry args={[0.075, 8, 6]} />
              <meshStandardMaterial color="#26354b" />
            </mesh>
            <mesh position={[x + 0.03, 0.08, 0.535]}>
              <sphereGeometry args={[0.024, 6, 4]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.18, 0.53]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#b75d58" flatShading />
        </mesh>
        <mesh position={[0, -0.3, 0.51]} scale={[0.12, 0.045, 0.035]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#70423a" flatShading />
        </mesh>
      </group>

      <group ref={torso} position={[0, 1.08, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.42, 0.38, 4, 7]} />
          <meshStandardMaterial color="#5c8f80" flatShading />
        </mesh>
      </group>

      <group ref={seatedLegs}>
        {[-0.29, 0.29].map((x) => (
          <group key={x}>
            <mesh castShadow position={[x, 0.63, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.15, 0.34, 3, 5]} />
              <meshStandardMaterial color="#f6bd75" flatShading />
            </mesh>
            <mesh castShadow position={[x, 0.34, 0.42]}>
              <capsuleGeometry args={[0.12, 0.35, 3, 5]} />
              <meshStandardMaterial color="#f6bd75" flatShading />
            </mesh>
            <mesh castShadow position={[x, 0.14, 0.54]}>
              <boxGeometry args={[0.34, 0.17, 0.42]} />
              <meshStandardMaterial color="#516d9d" flatShading />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={standingLegs} visible={false} scale={[1, 0, 1]}>
        {[-0.29, 0.29].map((x) => (
          <group key={x}>
            <mesh castShadow position={[x, 0.68, 0]}>
              <capsuleGeometry args={[0.14, 0.34, 3, 5]} />
              <meshStandardMaterial color="#f6bd75" flatShading />
            </mesh>
            <mesh castShadow position={[x, 0.32, 0]}>
              <capsuleGeometry args={[0.12, 0.28, 3, 5]} />
              <meshStandardMaterial color="#f6bd75" flatShading />
            </mesh>
            <mesh castShadow position={[x, 0.12, 0.14]}>
              <boxGeometry args={[0.34, 0.17, 0.42]} />
              <meshStandardMaterial color="#516d9d" flatShading />
            </mesh>
          </group>
        ))}
      </group>

      <mesh castShadow position={[0, 0.82, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.39, 0.105, 5, 8]} />
        <meshStandardMaterial color="#5dc6b2" flatShading />
      </mesh>
      <group ref={leftArm} position={[-0.47, 1.26, 0.03]} rotation={[0, 0, 0.18]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.095, 0.38, 3, 5]} />
          <meshStandardMaterial color="#f19a59" flatShading />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.47, 1.26, 0.03]} rotation={[0, 0, -0.18]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.095, 0.38, 3, 5]} />
          <meshStandardMaterial color="#f19a59" flatShading />
        </mesh>
      </group>
    </group>
  );
}
