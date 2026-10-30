import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto.js";
import { ContactMessagesService } from "./services/contact-messages.service.js";

@Controller("contact-messages")
export class ContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateContactMessageDto) {
    return this.contactMessagesService.create(body);
  }
}
