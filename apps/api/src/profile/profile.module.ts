import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PortfolioProfileEntity } from "./entities/portfolio-profile.entity.js";
import { ProfileController } from "./profile.controller.js";
import { ProfileRepository } from "./repository/profile.repository.js";
import { ProfileService } from "./services/profile.service.js";
import { AdminProfileController } from "./admin-profile.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioProfileEntity])],
  controllers: [ProfileController, AdminProfileController],
  providers: [ProfileRepository, ProfileService, SupabaseAdminGuard],
  exports: [ProfileService],
})
export class ProfileModule {}
