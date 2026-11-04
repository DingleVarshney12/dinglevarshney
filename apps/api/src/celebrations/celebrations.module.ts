import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { CelebrationEntity } from "./entities/celebration.entity.js";
import { CelebrationRepository } from "./repository/celebration.repository.js";
import { CelebrationsController } from "./celebrations.controller.js";
import { CelebrationsService } from "./celebrations.service.js";

@Module({ imports: [TypeOrmModule.forFeature([CelebrationEntity])], controllers: [CelebrationsController], providers: [CelebrationsService, CelebrationRepository, SupabaseAdminGuard] })
export class CelebrationsModule {}
