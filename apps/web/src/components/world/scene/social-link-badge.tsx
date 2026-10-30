import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { Vector3Tuple } from "three";
import type { SocialWallLink } from "../constants/social-links.constants";
import { SocialBrandIcon } from "./social-brand-icon";

type Props = {
  link: SocialWallLink;
  position: Vector3Tuple;
};

function openSocialLink(event: ThreeEvent<MouseEvent>, url: string) {
  event.stopPropagation();
  window.open(url, "_blank", "noopener,noreferrer");
}

function setPointerCursor() {
  document.body.style.cursor = "pointer";
}

function resetPointerCursor() {
  document.body.style.cursor = "";
}

export function SocialLinkBadge({ link, position }: Props) {
  return (
    <group position={position}>
      <mesh
        position={[0, -0.15, 0.025]}
        onClick={(event) => openSocialLink(event, link.url)}
        onPointerOver={setPointerCursor}
        onPointerOut={resetPointerCursor}
      >
        <planeGeometry args={[1.8, 1.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group
        position={[0, 0.1, 0.02]}
        onClick={(event) => openSocialLink(event, link.url)}
        onPointerOver={setPointerCursor}
        onPointerOut={resetPointerCursor}
      >
        <SocialBrandIcon platform={link.platform} />
      </group>
      <Text
        position={[0, -0.59, 0.01]}
        fontSize={0.28}
        fontWeight={600}
        anchorX="center"
        anchorY="middle"
        color="#c4ffe9"
        outlineWidth={0.01}
        outlineColor="#65d4be"
        onClick={(event) => openSocialLink(event, link.url)}
        onPointerOver={setPointerCursor}
        onPointerOut={resetPointerCursor}
      >
        {link.label}
      </Text>
    </group>
  );
}
