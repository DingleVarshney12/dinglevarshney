import { GithubIcon } from "../social-icons/github-icon";
import { InstagramIcon } from "../social-icons/instagram-icon";
import { LinkedinIcon } from "../social-icons/linkedin-icon";

export type SocialWallPlatform = "linkedin" | "instagram" | "github";
export type SocialWallLink = {
  platform: SocialWallPlatform;
  label: string;
  url: string;
};

export const SOCIAL_LINKS = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/dinglevarshney12",
    Icon: LinkedinIcon,
  },
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/coding.with.dingle",
    Icon: InstagramIcon,
  },
  {
    platform: "github",
    label: "GitHub",
    url: "https://github.com/DingleVarshney12",
    Icon: GithubIcon,
  },
] as const;
