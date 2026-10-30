export interface LeetcodeSolvedStats {
  username: string;
  profileUrl: string;
  avatarUrl: string | null;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  fetchedAt: string;
  stale: boolean;
}

export interface LeetcodeGraphqlResponse {
  data?: {
    matchedUser?: {
      profile?: { userAvatar?: string | null };
      submitStats?: {
        acSubmissionNum?: Array<{ difficulty: string; count: number }>;
      };
    } | null;
  };
}
