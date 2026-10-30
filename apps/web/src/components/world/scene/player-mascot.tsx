import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Vector3, type Group } from "three";
import {
  cameraLimits,
  playerConversationPosition,
  stops,
  workerConversationPosition,
} from "../constants/world.constants";
import type { InputState, StopId } from "../types/world.type";
import { isWorldObjectBlocking } from "../utils/collision";
import { findWorldPath } from "../utils/find-world-path";

type Props = {
  input: RefObject<InputState>;
  jumpQueued: RefObject<boolean>;
  active: boolean;
  mascotTalking: boolean;
  cameraRotation: RefObject<{ yaw: number; pitch: number }>;
  onNearbyChange: (id: StopId | null) => void;
};

export function Mascot({
  input,
  jumpQueued,
  active,
  mascotTalking,
  cameraRotation,
  onNearbyChange,
}: Props) {
  const mascot = useRef<Group>(null);
  const jumpVelocity = useRef(0);
  const jumpHeight = useRef(0);
  const cameraPosition = useRef(new Vector3());
  const cameraFocus = useRef(new Vector3(0, 0.85, 1.8));
  const cameraFocusTarget = useRef(new Vector3());
  const nearbyGate = useRef<StopId | null>(null);
  const wasTalking = useRef(false);
  const conversationPath = useRef<[number, number][]>([]);
  const conversationWaypoint = useRef(0);

  function approachAngle(current: number, target: number, amount: number) {
    const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + difference * amount;
  }

  useFrame(({ camera, clock }, delta) => {
    const group = mascot.current;
    if (!group) return;
    const keys = input.current;
    const step = Math.min(delta, 0.05);
    if (mascotTalking && !wasTalking.current) {
      conversationPath.current = findWorldPath(
        group.position.x,
        group.position.z,
        playerConversationPosition[0],
        playerConversationPosition[2],
      );
      conversationWaypoint.current = 0;
    }
    if (!mascotTalking) {
      conversationPath.current = [];
      conversationWaypoint.current = 0;
    }
    wasTalking.current = mascotTalking;

    if (active) {
      keys.forward = keys.backward = keys.left = keys.right = keys.jump = false;
      jumpQueued.current = false;
    }
    const inputX = active ? 0 : Number(keys.right) - Number(keys.left);
    const inputZ = active ? 0 : Number(keys.backward) - Number(keys.forward);
    let x =
      inputX * Math.cos(cameraRotation.current.yaw) + inputZ * Math.sin(cameraRotation.current.yaw);
    let z =
      -inputX * Math.sin(cameraRotation.current.yaw) +
      inputZ * Math.cos(cameraRotation.current.yaw);

    if (mascotTalking) {
      const waypoint = conversationPath.current[conversationWaypoint.current];
      if (waypoint) {
        const deltaX = waypoint[0] - group.position.x;
        const deltaZ = waypoint[1] - group.position.z;
        const distance = Math.hypot(deltaX, deltaZ);
        if (distance < 0.09) {
          conversationWaypoint.current += 1;
        } else {
          x = deltaX / distance;
          z = deltaZ / distance;
        }
      }
      if (conversationWaypoint.current >= conversationPath.current.length) {
        const faceX = workerConversationPosition[0] - group.position.x;
        const faceZ = workerConversationPosition[2] - group.position.z;
        const faceYaw = Math.atan2(faceX, faceZ);
        group.rotation.y = approachAngle(group.rotation.y, faceYaw, 1 - Math.exp(-step * 4));
      }
    }

    const moving = x !== 0 || z !== 0;
    if (moving) {
      const length = Math.hypot(x, z);
      x /= length;
      z /= length;
      const nextX = Math.max(-8.7, Math.min(8.7, group.position.x + x * step * 5.2));
      const nextZ = Math.max(-9.7, Math.min(5.8, group.position.z + z * step * 5.2));
      if (!isWorldObjectBlocking(nextX, group.position.z)) group.position.x = nextX;
      if (!isWorldObjectBlocking(group.position.x, nextZ)) group.position.z = nextZ;
      group.rotation.y = Math.atan2(x, z);
    }
    if (!active && jumpQueued.current && jumpHeight.current === 0) {
      jumpVelocity.current = 6.2;
      jumpQueued.current = false;
    }
    if (jumpHeight.current > 0 || jumpVelocity.current > 0) {
      jumpVelocity.current -= 15 * step;
      jumpHeight.current = Math.max(0, jumpHeight.current + jumpVelocity.current * step);
      if (jumpHeight.current === 0) jumpVelocity.current = 0;
    }
    const bob = moving && jumpHeight.current === 0 ? Math.sin(clock.elapsedTime * 13) * 0.045 : 0;
    const focusY = jumpHeight.current + bob;
    group.position.y = focusY;
    let candidate: StopId | null = null;
    let distanceToGate = 2.35;
    for (const stop of stops) {
      const distance = Math.hypot(
        group.position.x - stop.position[0],
        group.position.z - stop.position[2],
      );
      if (distance < distanceToGate) {
        candidate = stop.id;
        distanceToGate = distance;
      }
    }
    if (candidate !== nearbyGate.current) {
      nearbyGate.current = candidate;
      onNearbyChange(candidate);
    }
    const orbitRadius = cameraLimits.orbitRadius;
    const horizontalRadius = orbitRadius * Math.cos(cameraRotation.current.pitch);
    cameraPosition.current.set(
      Math.max(
        -9.55,
        Math.min(9.55, group.position.x + Math.sin(cameraRotation.current.yaw) * horizontalRadius),
      ),
      Math.min(
        cameraLimits.ceilingY,
        focusY + Math.sin(cameraRotation.current.pitch) * orbitRadius,
      ),
      Math.max(
        -10.55,
        Math.min(6.55, group.position.z + Math.cos(cameraRotation.current.yaw) * horizontalRadius),
      ),
    );
    const cameraFollow = 1 - Math.exp(-step * 2.8);
    if (mascotTalking) {
      const playerFacing =
        conversationWaypoint.current < conversationPath.current.length
          ? group.rotation.y
          : Math.atan2(
              workerConversationPosition[0] - group.position.x,
              workerConversationPosition[2] - group.position.z,
            );
      cameraRotation.current.yaw = approachAngle(
        cameraRotation.current.yaw,
        playerFacing - Math.PI,
        1 - Math.exp(-step * 2),
      );
      cameraRotation.current.pitch = 0.2;
    }
    camera.position.lerp(cameraPosition.current, cameraFollow);
    cameraFocusTarget.current.set(
      mascotTalking ? (group.position.x + workerConversationPosition[0]) / 2 : group.position.x,
      focusY + (mascotTalking ? 1.1 : 0.85),
      mascotTalking ? (group.position.z + workerConversationPosition[2]) / 2 : group.position.z,
    );
    cameraFocus.current.lerp(cameraFocusTarget.current, cameraFollow);
    camera.lookAt(cameraFocus.current);
  });

  return (
    <group ref={mascot} position={[0, 0, 1.8]} rotation={[0, Math.PI, 0]}>
      <mesh castShadow position={[0, 0.53, 0]}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#f19a59" flatShading roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.34, 0.02]} scale={[1, 1.06, 0.9]}>
        <icosahedronGeometry args={[0.63, 1]} />
        <meshStandardMaterial color="#ffc46f" flatShading roughness={0.76} />
      </mesh>
      <mesh castShadow position={[-0.39, 1.84, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.22, 0.62, 5]} />
        <meshStandardMaterial color="#f19a59" flatShading />
      </mesh>
      <mesh castShadow position={[0.39, 1.84, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.22, 0.62, 5]} />
        <meshStandardMaterial color="#f19a59" flatShading />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 1.39, 0.53]}>
          <sphereGeometry args={[0.105, 8, 6]} />
          <meshStandardMaterial color="#26354b" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1.16, 0.59]}>
        <icosahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#b75d58" flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.82, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.39, 0.105, 5, 8]} />
        <meshStandardMaterial color="#5dc6b2" flatShading />
      </mesh>
      <mesh castShadow position={[0.42, 0.61, -0.43]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.52, 0.63, 0.28]} />
        <meshStandardMaterial color="#7587d9" flatShading />
      </mesh>
      {[-0.29, 0.29].map((x) => (
        <mesh key={x} castShadow position={[x, 0.24, 0.03]}>
          <capsuleGeometry args={[0.14, 0.2, 3, 5]} />
          <meshStandardMaterial color="#f6bd75" flatShading />
        </mesh>
      ))}
      {[-0.47, 0.47].map((x) => (
        <mesh key={x} castShadow position={[x, 0.61, 0]} rotation={[0, 0, x < 0 ? -0.75 : 0.75]}>
          <capsuleGeometry args={[0.13, 0.32, 3, 5]} />
          <meshStandardMaterial color="#f19a59" flatShading />
        </mesh>
      ))}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#436b50" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
