import { Injectable, NotFoundException } from "@nestjs/common";
import { SaveResumeEntryDto, UpdateResumeEntryDto } from "../dto/save-resume-entry.dto.js";
import { ResumeEntryRepository } from "../repository/resume-entry.repository.js";

@Injectable()
export class ResumeContentService {
  constructor(private readonly repository: ResumeEntryRepository) {}
  findPublished() {
    return this.repository.findPublished();
  }
  findAll() {
    return this.repository.findAll();
  }
  create(input: SaveResumeEntryDto) {
    return this.repository.create(input);
  }
  async update(id: string, input: UpdateResumeEntryDto) {
    const entry = await this.repository.update(id, input);
    if (!entry) throw new NotFoundException("Resume entry not found.");
    return entry;
  }
  async remove(id: string) {
    if (!(await this.repository.remove(id))) throw new NotFoundException("Resume entry not found.");
  }
}
