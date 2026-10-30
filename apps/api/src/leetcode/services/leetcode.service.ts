import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type { LeetcodeGraphqlResponse, LeetcodeSolvedStats } from "../leetcode.types.js";

const solvedProblemsQuery = `
  query userSolved($username: String!) {
    matchedUser(username: $username) {
      profile { userAvatar }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
  }
`;

const cacheDurationMs = 30 * 60 * 1000;

@Injectable()
export class LeetcodeService {
  private cachedStats: LeetcodeSolvedStats | null = null;
  private cacheExpiresAt = 0;

  async getSolvedStats(): Promise<LeetcodeSolvedStats> {
    if (this.cachedStats && Date.now() < this.cacheExpiresAt) {
      return { ...this.cachedStats, stale: false };
    }

    const username = process.env.LEETCODE_USERNAME?.trim() || "cwd12112006";

    try {
      const response = await fetch("https://leetcode.com/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/",
        },
        body: JSON.stringify({ query: solvedProblemsQuery, variables: { username } }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });

      if (!response.ok) throw new Error(`LeetCode returned HTTP ${response.status}.`);
      const payload = (await response.json()) as LeetcodeGraphqlResponse;
      const entries = payload.data?.matchedUser?.submitStats?.acSubmissionNum;
      if (!entries) throw new Error("LeetCode did not return public profile statistics.");

      const countFor = (difficulty: string) =>
        entries.find((entry) => entry.difficulty === difficulty)?.count ?? 0;
      const now = new Date().toISOString();
      const stats: LeetcodeSolvedStats = {
        username,
        profileUrl: `https://leetcode.com/u/${encodeURIComponent(username)}/`,
        avatarUrl: payload.data?.matchedUser?.profile?.userAvatar ?? null,
        totalSolved: countFor("All"),
        easySolved: countFor("Easy"),
        mediumSolved: countFor("Medium"),
        hardSolved: countFor("Hard"),
        fetchedAt: now,
        stale: false,
      };

      this.cachedStats = stats;
      this.cacheExpiresAt = Date.now() + cacheDurationMs;
      return stats;
    } catch (error) {
      if (this.cachedStats) return { ...this.cachedStats, stale: true };
      throw new ServiceUnavailableException("LeetCode statistics are temporarily unavailable.", {
        cause: error,
      });
    }
  }
}
