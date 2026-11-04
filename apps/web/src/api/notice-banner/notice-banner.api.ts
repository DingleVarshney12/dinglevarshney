import { apiClient } from "../api-client";
import type { NoticeBanner } from "./notice-banner.type";

export const getNoticeBanner = () => apiClient.get<NoticeBanner | null>("/notice-banner");
export const getAdminNoticeBanner = (token: string) =>
  apiClient.get<NoticeBanner | null>("/admin/notice-banner", token);
export async function saveNoticeBanner(input: NoticeBanner, token: string): Promise<NoticeBanner> {
  const payload: NoticeBanner = {
    isEnabled: input.isEnabled,
    text: input.text,
    linkLabel: input.linkLabel,
    linkUrl: input.linkUrl,
    backgroundColor: input.backgroundColor,
  };
  const saved = await apiClient.put<NoticeBanner, NoticeBanner | undefined>(
    "/admin/notice-banner",
    payload,
    token,
  );
  return saved ?? payload;
}
