import type { Skill, SkillInput, SkillQuery, UpdateSkillInput } from "./skill.type";
import { apiClient } from "../api-client";

export function getSkills(query: SkillQuery = {}): Promise<Skill[]> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  const suffix = params.size ? `?${params.toString()}` : "";
  return apiClient.get<Skill[]>(`/skills${suffix}`);
}

export function getAdminSkills(accessToken: string): Promise<Skill[]> {
  return apiClient.get<Skill[]>("/admin/skills", accessToken);
}

export function createSkill(input: SkillInput, accessToken: string): Promise<Skill> {
  return apiClient.post<SkillInput, Skill>("/admin/skills", input, accessToken);
}

export function updateSkill(
  id: string,
  input: UpdateSkillInput,
  accessToken: string,
): Promise<Skill> {
  return apiClient.patch<UpdateSkillInput, Skill>(`/admin/skills/${id}`, input, accessToken);
}

export function deleteSkill(id: string, accessToken: string): Promise<void> {
  return apiClient.delete<void>(`/admin/skills/${id}`, accessToken);
}
