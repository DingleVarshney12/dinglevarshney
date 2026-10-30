import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { UpdateContactMessageDto } from "./dto/update-contact-message.dto.js";
import { ContactMessagesService } from "./services/contact-messages.service.js";

@Controller("admin/contact-messages")
@UseGuards(SupabaseAdminGuard)
export class AdminContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Get()
  findAll() {
    return this.contactMessagesService.findAll();
  }

  @Patch(":id")
  updateStatus(@Param("id", ParseUUIDPipe) id: string, @Body() input: UpdateContactMessageDto) {
    return this.contactMessagesService.updateStatus(id, input.status);
  }
}
