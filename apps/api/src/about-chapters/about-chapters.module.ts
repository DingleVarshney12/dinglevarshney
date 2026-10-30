import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AboutChaptersController } from "./about-chapters.controller.js";
import { AboutChapterEntity } from "./entities/about-chapter.entity.js";
import { AboutChapterRepository } from "./repository/about-chapter.repository.js";
import { AboutChaptersService } from "./services/about-chapters.service.js";
import { AdminAboutChaptersController } from "./admin-about-chapters.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([AboutChapterEntity])],
  controllers: [AboutChaptersController, AdminAboutChaptersController],
  providers: [AboutChapterRepository, AboutChaptersService, SupabaseAdminGuard],
  exports: [AboutChaptersService],
})
export class AboutChaptersModule {}
