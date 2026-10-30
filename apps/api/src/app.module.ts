import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module.js";
import { AboutChaptersModule } from "./about-chapters/about-chapters.module.js";
import { CertificatesModule } from "./certificates/certificates.module.js";
import { ContactMessagesModule } from "./contact-messages/contact-messages.module.js";
import { MascotDialoguesModule } from "./mascot-dialogues/mascot-dialogues.module.js";
import { ProfileModule } from "./profile/profile.module.js";
import { ProjectsModule } from "./projects/projects.module.js";
import { SkillsModule } from "./skills/skills.module.js";
import { HealthModule } from "./health/health.module.js";
import { LeetcodeModule } from "./leetcode/leetcode.module.js";
import { ResumeContentModule } from "./resume-content/resume-content.module.js";

const databaseModules = process.env.DATABASE_URL
  ? [
      DatabaseModule,
      ProjectsModule,
      CertificatesModule,
      SkillsModule,
      AboutChaptersModule,
      ProfileModule,
      MascotDialoguesModule,
      ContactMessagesModule,
      ResumeContentModule,
    ]
  : [];

@Module({ imports: [HealthModule, LeetcodeModule, ...databaseModules] })
export class AppModule {}
