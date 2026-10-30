import { getAboutChapters } from "../about-chapter/about-chapter.api";
import { getCertificates } from "../certificate/certificate.api";
import { getMascotDialogues } from "../mascot-dialogue/mascot-dialogue.api";
import { getPortfolioProfile } from "../portfolio-profile/portfolio-profile.api";
import { getProjects } from "../project/project.api";
import { getSkills } from "../skill/skill.api";
import { getResumeEntries } from "../resume-content/resume-content.api";
import type { PublicPortfolioData } from "./portfolio.type";

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  const results = await Promise.allSettled([
    getPortfolioProfile(),
    getProjects(),
    getCertificates(),
    getSkills(),
    getAboutChapters(),
    getMascotDialogues(),
    getResumeEntries(),
  ]);

  const value = <T>(index: number, fallback: T): T => {
    const result = results[index];
    return result.status === "fulfilled" ? (result.value as T) : fallback;
  };

  const resourceNames = [
    "profile",
    "projects",
    "certificates",
    "skills",
    "about story",
    "mascot conversation",
    "resume content",
  ];
  const failedResources = results.flatMap((result, index) =>
    result.status === "rejected" ? [resourceNames[index]] : [],
  );

  return {
    profile: value(0, null),
    projects: value(1, []),
    certificates: value(2, []),
    skills: value(3, []),
    aboutChapters: value(4, []),
    mascotDialogues: value(5, []),
    resumeEntries: value(6, []),
    apiAvailable: results.slice(1).some((result) => result.status === "fulfilled"),
    failedResources,
  };
}
