import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { AdminResumeContentController } from "./admin-resume-content.controller.js";
import { ResumeEntryEntity } from "./entities/resume-entry.entity.js";
import { ResumeContentController } from "./resume-content.controller.js";
import { ResumeEntryRepository } from "./repository/resume-entry.repository.js";
import { ResumeContentService } from "./services/resume-content.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([ResumeEntryEntity])],
  controllers: [ResumeContentController, AdminResumeContentController],
  providers: [ResumeEntryRepository, ResumeContentService, SupabaseAdminGuard],
})
export class ResumeContentModule {}
