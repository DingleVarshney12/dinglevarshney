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
