import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactMessagesController } from "./contact-messages.controller.js";
import { ContactMessageEntity } from "./entities/contact-message.entity.js";
import { ContactMessageRepository } from "./repository/contact-message.repository.js";
import { ContactMessagesService } from "./services/contact-messages.service.js";
import { AdminContactMessagesController } from "./admin-contact-messages.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessageEntity])],
  controllers: [ContactMessagesController, AdminContactMessagesController],
  providers: [ContactMessageRepository, ContactMessagesService, SupabaseAdminGuard],
})
export class ContactMessagesModule {}
