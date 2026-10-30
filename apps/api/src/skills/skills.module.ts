import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SkillsController } from "./skills.controller.js";
import { SkillEntity } from "./entities/skill.entity.js";
import { SkillRepository } from "./repository/skill.repository.js";
import { SkillsService } from "./services/skills.service.js";
import { AdminSkillsController } from "./admin-skills.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity])],
  controllers: [SkillsController, AdminSkillsController],
  providers: [SkillRepository, SkillsService, SupabaseAdminGuard],
  exports: [SkillsService],
})
export class SkillsModule {}
