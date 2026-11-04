import type { AboutChapter } from "../about-chapter/about-chapter.type";
import type { Certificate } from "../certificate/certificate.type";
import type { MascotDialogue } from "../mascot-dialogue/mascot-dialogue.type";
import type { PortfolioProfile } from "../portfolio-profile/portfolio-profile.type";
import type { Project } from "../project/project.type";
import type { Skill } from "../skill/skill.type";
import type { ResumeEntry } from "../resume-content/resume-content.type";
import type { CelebrationConfig } from "../celebration/celebration.type";
import type { NoticeBanner } from "../notice-banner/notice-banner.type";

export interface PublicPortfolioData {
  profile: PortfolioProfile | null;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  aboutChapters: AboutChapter[];
  mascotDialogues: MascotDialogue[];
  resumeEntries: ResumeEntry[];
  celebration: CelebrationConfig | null;
  noticeBanner: NoticeBanner | null;
  apiAvailable: boolean;
  failedResources: string[];
}
