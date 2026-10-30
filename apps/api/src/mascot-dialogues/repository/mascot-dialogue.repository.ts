import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MascotDialogueEntity } from "../entities/mascot-dialogue.entity.js";
import { CreateMascotDialogueDto } from "../dto/create-mascot-dialogue.dto.js";
import { UpdateMascotDialogueDto } from "../dto/update-mascot-dialogue.dto.js";

@Injectable()
export class MascotDialogueRepository {
  constructor(
    @InjectRepository(MascotDialogueEntity)
    private readonly repository: Repository<MascotDialogueEntity>,
  ) {}
  findPublished() {
    return this.repository.find({ where: { isPublished: true }, order: { sortOrder: "ASC" } });
  }
  findAll() {
    return this.repository.find({ order: { sortOrder: "ASC", createdAt: "DESC" } });
  }
  create(input: CreateMascotDialogueDto) {
    return this.repository.save(
      this.repository.create({
        ...input,
        isPublished: input.isPublished ?? false,
        sortOrder: input.sortOrder ?? 0,
      }),
    );
  }
  async update(id: string, input: UpdateMascotDialogueDto) {
    const dialogue = await this.repository.findOneBy({ id });
    if (!dialogue) return null;
    this.repository.merge(dialogue, input);
    return this.repository.save(dialogue);
  }
  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
