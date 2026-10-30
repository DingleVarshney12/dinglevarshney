export type { Skill } from "@/lib/types";
import type { Skill } from "@/lib/types";

export type SkillInput = Omit<Skill, "id" | "createdAt" | "updatedAt">;
export type UpdateSkillInput = Partial<SkillInput>;

export interface SkillQuery {
  category?: string;
}
