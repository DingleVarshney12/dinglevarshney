import "reflect-metadata";
import { existsSync } from "node:fs";
import { DataSource } from "typeorm";
import { AboutChapterEntity } from "../about-chapters/entities/about-chapter.entity.js";
import { CertificateEntity } from "../certificates/entities/certificate.entity.js";
import { ContactMessageEntity } from "../contact-messages/entities/contact-message.entity.js";
import { MascotDialogueEntity } from "../mascot-dialogues/entities/mascot-dialogue.entity.js";
import { PortfolioProfileEntity } from "../profile/entities/portfolio-profile.entity.js";
import { ProjectEntity } from "../projects/entities/project.entity.js";
import { SkillEntity } from "../skills/entities/skill.entity.js";
import { ResumeEntryEntity } from "../resume-content/entities/resume-entry.entity.js";
import { CelebrationEntity } from "../celebrations/entities/celebration.entity.js";
import { NoticeBannerEntity } from "../notice-banner/notice-banner.entity.js";

if (existsSync(".env")) process.loadEnvFile(".env");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  entities: [
    ProjectEntity,
    CertificateEntity,
    SkillEntity,
    AboutChapterEntity,
    PortfolioProfileEntity,
    MascotDialogueEntity,
    ContactMessageEntity,
    ResumeEntryEntity,
    CelebrationEntity,
    NoticeBannerEntity,
  ],
  migrations: ["dist/database/migrations/*.js"],
  migrationsTableName: "typeorm_migrations",
  synchronize: false,
});
