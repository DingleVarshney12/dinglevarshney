import { apiClient } from "../api-client";
import { ApiError } from "../api-error";
import type { PortfolioProfile } from "./portfolio-profile.type";
import type { AdminPortfolioProfile, SavePortfolioProfileInput } from "./portfolio-profile.type";

export async function getPortfolioProfile(): Promise<PortfolioProfile | null> {
  try {
    return await apiClient.get<PortfolioProfile>("/profile");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getAdminPortfolioProfile(
  accessToken: string,
): Promise<AdminPortfolioProfile | null> {
  try {
    return await apiClient.get<AdminPortfolioProfile>("/admin/profile", accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function saveAdminPortfolioProfile(
  input: SavePortfolioProfileInput,
  accessToken: string,
): Promise<AdminPortfolioProfile> {
  return apiClient.put<SavePortfolioProfileInput, AdminPortfolioProfile>(
    "/admin/profile",
    input,
    accessToken,
  );
}
