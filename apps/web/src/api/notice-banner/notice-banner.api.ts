import { apiClient } from "../api-client";
import type { NoticeBanner } from "./notice-banner.type";

export const getNoticeBanner = () => apiClient.get<NoticeBanner | null>("/notice-banner");
export const getAdminNoticeBanner = (token: string) => apiClient.get<NoticeBanner | null>("/admin/notice-banner", token);
export async function saveNoticeBanner(input: NoticeBanner, token: string): Promise<NoticeBanner> {
  const saved = await apiClient.put<NoticeBanner, NoticeBanner | undefined>(
    "/admin/notice-banner",
    input,
    token,
  );
  return saved ?? input;
}
