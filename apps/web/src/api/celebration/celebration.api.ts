import { apiClient } from "../api-client";
import type { CelebrationConfig } from "./celebration.type";

export const getActiveCelebration = () => apiClient.get<CelebrationConfig | null>("/celebration");

export const getCelebrations = (token: string) =>
  apiClient.get<CelebrationConfig[]>("/admin/celebrations", token);

export const saveCelebration = (input: Omit<CelebrationConfig, "id"> & { id?: string }, token: string) =>
  apiClient.put<Omit<CelebrationConfig, "id"> & { id?: string }, CelebrationConfig>("/admin/celebrations", input, token);

export const deleteCelebration = (id: string, token: string) =>
  apiClient.delete<void>(`/admin/celebrations/${id}`, token);
