import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SkillEntity } from "../entities/skill.entity.js";
import { CreateSkillDto } from "../dto/create-skill.dto.js";
import { UpdateSkillDto } from "../dto/update-skill.dto.js";

@Injectable()
export class SkillRepository {
  constructor(
    @InjectRepository(SkillEntity) private readonly repository: Repository<SkillEntity>,
  ) {}
  findPublished(category?: string) {
    return this.repository.find({
      where: category ? { isPublished: true, category } : { isPublished: true },
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }
  findAll() {
    return this.repository.find({ order: { sortOrder: "ASC", name: "ASC" } });
  }
  create(input: CreateSkillDto) {
    return this.repository.save(
      this.repository.create({
        ...input,
        level: input.level ?? null,
        yearsOfExperience: input.yearsOfExperience ?? null,
        iconUrl: input.iconUrl ?? null,
        isPublished: input.isPublished ?? false,
        sortOrder: input.sortOrder ?? 0,
      }),
    );
  }
  async update(id: string, input: UpdateSkillDto) {
    const skill = await this.repository.findOneBy({ id });
    if (!skill) return null;
    this.repository.merge(skill, input);
    return this.repository.save(skill);
  }
  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
