import { apiClient } from "../api-client";
import type { CelebrationConfig } from "./celebration.type";

export const getActiveCelebration = () => apiClient.get<CelebrationConfig | null>("/celebration");

export const getCelebrations = (token: string) =>
  apiClient.get<CelebrationConfig[]>("/admin/celebrations", token);

export const saveCelebration = (
  input: Omit<CelebrationConfig, "id"> & { id?: string },
  token: string,
) => {
  const payload = {
    id: input.id,
    name: input.name,
    message: input.message,
    effect: input.effect,
    accentColor: input.accentColor,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    yearly: input.yearly,
    isEnabled: input.isEnabled,
  };
  return apiClient.put<typeof payload, CelebrationConfig>("/admin/celebrations", payload, token);
};

export const deleteCelebration = (id: string, token: string) =>
  apiClient.delete<void>(`/admin/celebrations/${id}`, token);
