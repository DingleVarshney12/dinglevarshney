import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MascotDialogueEntity } from "./entities/mascot-dialogue.entity.js";
import { MascotDialoguesController } from "./mascot-dialogues.controller.js";
import { MascotDialogueRepository } from "./repository/mascot-dialogue.repository.js";
import { MascotDialoguesService } from "./services/mascot-dialogues.service.js";
import { AdminMascotDialoguesController } from "./admin-mascot-dialogues.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([MascotDialogueEntity])],
  controllers: [MascotDialoguesController, AdminMascotDialoguesController],
  providers: [MascotDialogueRepository, MascotDialoguesService, SupabaseAdminGuard],
  exports: [MascotDialoguesService],
})
export class MascotDialoguesModule {}
