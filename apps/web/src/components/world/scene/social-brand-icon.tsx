import { Svg } from "@react-three/drei";
import { useMemo } from "react";
import { GITHUB_ICON_MARKUP } from "../social-icons/github-icon";
import { INSTAGRAM_ICON_MARKUP } from "../social-icons/instagram-icon";
import { LINKEDIN_ICON_MARKUP } from "../social-icons/linkedin-icon";
import type { SocialWallPlatform } from "../constants/social-links.constants";

const ICON_MARKUP: Record<SocialWallPlatform, string> = {
  linkedin: LINKEDIN_ICON_MARKUP,
  instagram: INSTAGRAM_ICON_MARKUP,
  github: GITHUB_ICON_MARKUP,
};

export function SocialBrandIcon({ platform }: { platform: SocialWallPlatform }) {
  const source = useMemo(() => {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${ICON_MARKUP[platform].replaceAll("currentColor", "#c4ffe9")}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(markup)}`;
  }, [platform]);

  return (
    <group scale={[0.024, 0.024, 0.024]}>
      <Svg
        src={source}
        position={[-12, 12, 0]}
        fillMaterial={{ color: "#c4ffe9", toneMapped: false, opacity: 0.98 }}
        strokeMaterial={{ color: "#c4ffe9", toneMapped: false, opacity: 0.98 }}
      />
    </group>
  );
}
