import { Injectable } from "@nestjs/common";
import { SkillRepository } from "../repository/skill.repository.js";
import { CreateSkillDto } from "../dto/create-skill.dto.js";
import { UpdateSkillDto } from "../dto/update-skill.dto.js";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class SkillsService {
  constructor(private readonly skillRepository: SkillRepository) {}
  findPublished(category?: string) {
    return this.skillRepository.findPublished(category);
  }
  findAll() {
    return this.skillRepository.findAll();
  }
  create(input: CreateSkillDto) {
    return this.skillRepository.create(input);
  }
  async update(id: string, input: UpdateSkillDto) {
    const skill = await this.skillRepository.update(id, input);
    if (!skill) throw new NotFoundException("Skill not found.");
    return skill;
  }
  async remove(id: string) {
    const removed = await this.skillRepository.remove(id);
    if (!removed) throw new NotFoundException("Skill not found.");
  }
}
