import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContactMessageDto } from "../dto/create-contact-message.dto.js";
import { ContactMessageRepository } from "../repository/contact-message.repository.js";
import type { ContactMessageStatus } from "@dinglevarshney/shared";

@Injectable()
export class ContactMessagesService {
  constructor(private readonly contactMessageRepository: ContactMessageRepository) {}
  create(input: CreateContactMessageDto) {
    return this.contactMessageRepository.createAndSave(input);
  }
  findAll() {
    return this.contactMessageRepository.findAll();
  }
  async updateStatus(id: string, status: ContactMessageStatus) {
    const message = await this.contactMessageRepository.updateStatus(id, status);
    if (!message) throw new NotFoundException("Contact message not found.");
    return message;
  }
}
