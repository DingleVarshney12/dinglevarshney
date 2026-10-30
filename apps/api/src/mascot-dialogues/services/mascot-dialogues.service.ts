import { Injectable, NotFoundException } from "@nestjs/common";
import { MascotDialogueRepository } from "../repository/mascot-dialogue.repository.js";
import { CreateMascotDialogueDto } from "../dto/create-mascot-dialogue.dto.js";
import { UpdateMascotDialogueDto } from "../dto/update-mascot-dialogue.dto.js";

@Injectable()
export class MascotDialoguesService {
  constructor(private readonly mascotDialogueRepository: MascotDialogueRepository) {}
  findPublished() {
    return this.mascotDialogueRepository.findPublished();
  }
  findAll() {
    return this.mascotDialogueRepository.findAll();
  }
  create(input: CreateMascotDialogueDto) {
    return this.mascotDialogueRepository.create(input);
  }
  async update(id: string, input: UpdateMascotDialogueDto) {
    const dialogue = await this.mascotDialogueRepository.update(id, input);
    if (!dialogue) throw new NotFoundException("Mascot conversation not found.");
    return dialogue;
  }
  async remove(id: string) {
    if (!(await this.mascotDialogueRepository.remove(id)))
      throw new NotFoundException("Mascot conversation not found.");
  }
}
