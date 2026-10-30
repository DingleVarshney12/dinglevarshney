import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectsController } from "./projects.controller.js";
import { ProjectEntity } from "./entities/project.entity.js";
import { ProjectRepository } from "./repository/project.repository.js";
import { ProjectsService } from "./services/projects.service.js";
import { AdminProjectsController } from "./admin-projects.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectsController, AdminProjectsController],
  providers: [ProjectRepository, ProjectsService, SupabaseAdminGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
