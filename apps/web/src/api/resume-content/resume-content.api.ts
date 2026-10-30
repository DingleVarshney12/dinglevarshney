import { apiClient } from "../api-client";
import type { ResumeEntry } from "./resume-content.type";

export type SaveResumeEntryInput = Omit<ResumeEntry, "id" | "createdAt" | "updatedAt">;
export type UpdateResumeEntryInput = Partial<SaveResumeEntryInput>;

export function getResumeEntries() {
  return apiClient.get<ResumeEntry[]>("/resume-content");
}
export function getAdminResumeEntries(token: string) {
  return apiClient.get<ResumeEntry[]>("/admin/resume-content", token);
}
export function createResumeEntry(input: SaveResumeEntryInput, token: string) {
  return apiClient.post<SaveResumeEntryInput, ResumeEntry>("/admin/resume-content", input, token);
}
export function updateResumeEntry(id: string, input: UpdateResumeEntryInput, token: string) {
  return apiClient.patch<UpdateResumeEntryInput, ResumeEntry>(
    `/admin/resume-content/${id}`,
    input,
    token,
  );
}
export function deleteResumeEntry(id: string, token: string) {
  return apiClient.delete<void>(`/admin/resume-content/${id}`, token);
}
