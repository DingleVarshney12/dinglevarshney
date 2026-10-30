import { apiClient } from "../api-client";
import type { LeetcodeSolvedStats } from "./leetcode.type";

export const LEETCODE_PROFILE_URL = "https://leetcode.com/u/cwd12112006/";

export function getLeetcodeSolvedStats(): Promise<LeetcodeSolvedStats> {
  return apiClient.get<LeetcodeSolvedStats>("/leetcode/stats");
}
