export type SocialPlatform =
  "github" | "linkedin" | "instagram" | "youtube" | "x" | "website" | "leetcode" | "other";

export interface SocialLink {
  id: string;
  label: string;
  platform: SocialPlatform;
  url: string;
  sortOrder?: number;
}

export type ResumeEntryKind = "education" | "experience" | "activity" | "language" | "interest";

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";
