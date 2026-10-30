export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  category: string;
  technologies: string[];
  images: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  role?: string | null;
  year?: number | null;
  featured: boolean;
  isPublished: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
  isPublished: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience?: number | null;
  iconUrl?: string | null;
  isPublished: boolean;
  sortOrder?: number;
}

export interface AboutChapter {
  id: string;
  title: string;
  content: string;
  year?: number | null;
  imageUrl?: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface PortfolioProfile {
  name: string;
  headline: string;
  shortBio: string;
  about: string;
  avatarUrl?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  socialLinks: import("@dinglevarshney/shared").SocialLink[];
  updatedAt?: string;
}

export interface MascotDialogue {
  id: string;
  question: string;
  answer: string;
  topic: string;
  isPublished: boolean;
  sortOrder?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: import("@dinglevarshney/shared").ContactMessageStatus;
  createdAt: string;
}

export type ResumeEntryKind = import("@dinglevarshney/shared").ResumeEntryKind;

export interface ResumeEntry {
  id: string;
  kind: ResumeEntryKind;
  title: string;
  organization?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  details?: string | null;
  bullets: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioContent {
  profile: PortfolioProfile;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  aboutChapters: AboutChapter[];
  mascotDialogues: MascotDialogue[];
}
