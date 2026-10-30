import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContactMessageEntity } from "../entities/contact-message.entity.js";

@Injectable()
export class ContactMessageRepository {
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly repository: Repository<ContactMessageEntity>,
  ) {}

  createAndSave(input: Pick<ContactMessageEntity, "name" | "email" | "message">) {
    return this.repository.save(this.repository.create(input));
  }

  findAll() {
    return this.repository.find({ order: { createdAt: "DESC" } });
  }

  async updateStatus(id: string, status: ContactMessageEntity["status"]) {
    const message = await this.repository.findOneBy({ id });
    if (!message) return null;
    message.status = status;
    return this.repository.save(message);
  }
}
