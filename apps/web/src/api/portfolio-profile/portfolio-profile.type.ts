export type { PortfolioProfile } from "@/lib/types";
export type { SocialLink, SocialPlatform } from "@dinglevarshney/shared";
import type { PortfolioProfile } from "@/lib/types";

export interface AdminPortfolioProfile extends PortfolioProfile {
  id: string;
  isPublished: boolean;
}

export type SavePortfolioProfileInput = Omit<AdminPortfolioProfile, "id" | "updatedAt">;
