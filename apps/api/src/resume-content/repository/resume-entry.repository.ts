import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { ResumeEntryKind } from "@dinglevarshney/shared";
import { ResumeEntryEntity } from "../entities/resume-entry.entity.js";
import { SaveResumeEntryDto, UpdateResumeEntryDto } from "../dto/save-resume-entry.dto.js";

@Injectable()
export class ResumeEntryRepository {
  constructor(
    @InjectRepository(ResumeEntryEntity) private readonly repository: Repository<ResumeEntryEntity>,
  ) {}

  findPublished() {
    return this.repository.find({
      where: { isPublished: true },
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });
  }

  findAll() {
    return this.repository.find({ order: { sortOrder: "ASC", createdAt: "ASC" } });
  }

  create(input: SaveResumeEntryDto) {
    return this.repository.save(
      this.repository.create({
        ...input,
        organization: input.organization || null,
        location: input.location || null,
        startDate: input.startDate || null,
        endDate: input.endDate || null,
        details: input.details || null,
        bullets: input.bullets ?? [],
        sortOrder: input.sortOrder ?? 0,
      }),
    );
  }

  async update(id: string, input: UpdateResumeEntryDto) {
    const entry = await this.repository.findOneBy({ id });
    if (!entry) return null;
    this.repository.merge(entry, input);
    return this.repository.save(entry);
  }

  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  findByKind(kind: ResumeEntryKind) {
    return this.repository.find({
      where: { kind, isPublished: true },
      order: { sortOrder: "ASC" },
    });
  }
}
