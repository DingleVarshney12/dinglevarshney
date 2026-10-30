import { apiClient } from "../api-client";
import type {
  AboutChapter,
  AboutChapterInput,
  UpdateAboutChapterInput,
} from "./about-chapter.type";

export function getAboutChapters(): Promise<AboutChapter[]> {
  return apiClient.get<AboutChapter[]>("/about/chapters");
}

export function getAdminAboutChapters(accessToken: string): Promise<AboutChapter[]> {
  return apiClient.get<AboutChapter[]>("/admin/about/chapters", accessToken);
}

export function createAboutChapter(
  input: AboutChapterInput,
  accessToken: string,
): Promise<AboutChapter> {
  return apiClient.post<AboutChapterInput, AboutChapter>(
    "/admin/about/chapters",
    input,
    accessToken,
  );
}

export function updateAboutChapter(
  id: string,
  input: UpdateAboutChapterInput,
  accessToken: string,
): Promise<AboutChapter> {
  return apiClient.patch<UpdateAboutChapterInput, AboutChapter>(
    `/admin/about/chapters/${id}`,
    input,
    accessToken,
  );
}

export function deleteAboutChapter(id: string, accessToken: string): Promise<void> {
  return apiClient.delete<void>(`/admin/about/chapters/${id}`, accessToken);
}
