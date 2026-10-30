import { Text } from "@react-three/drei";
import { SOCIAL_LINKS } from "../constants/social-links.constants";
import { SocialLinkBadge } from "./social-link-badge";
import type { SocialLink } from "@dinglevarshney/shared";
import type { SocialWallLink } from "../constants/social-links.constants";

const SOCIAL_LINK_POSITIONS = [-2.35, 0, 2.35] as const;

const supportedPlatforms = ["linkedin", "instagram", "github"] as const;

function isSocialWallLink(link: SocialLink): link is SocialLink & SocialWallLink {
  return supportedPlatforms.some((platform) => platform === link.platform);
}

export function SocialWallSign({ profileLinks }: { profileLinks?: SocialLink[] }) {
  const links: SocialWallLink[] =
    profileLinks === undefined
      ? SOCIAL_LINKS.map(({ platform, label, url }) => ({ platform, label, url }))
      : profileLinks.filter(isSocialWallLink).slice(0, SOCIAL_LINK_POSITIONS.length);

  return (
    <group position={[-9.78, 2.35, -1.8]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[7.8, 2.5, 0.08]} />
        <meshStandardMaterial color="#5c422d" roughness={0.74} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[7.68, 2.38, 0.025]} />
        <meshStandardMaterial color="#243b43" roughness={0.62} />
      </mesh>

      <Text
        position={[0, 0.69, 0.07]}
        fontSize={0.48}
        fontWeight={800}
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
        color="#a2f2d8"
        outlineWidth={0.016}
        outlineColor="#65d4be"
      >
        CONNECT ME ON
      </Text>

      {links.map((link, index) => (
        <SocialLinkBadge
          key={link.platform}
          link={link}
          position={[SOCIAL_LINK_POSITIONS[index], 0, 0.08]}
        />
      ))}
    </group>
  );
}
