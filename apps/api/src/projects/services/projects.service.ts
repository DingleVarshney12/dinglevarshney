import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectRepository } from "../repository/project.repository.js";
import { CreateProjectDto } from "../dto/create-project.dto.js";
import { UpdateProjectDto } from "../dto/update-project.dto.js";

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  findPublished(category?: string) {
    return this.projectRepository.findPublished(category);
  }

  findBySlug(slug: string) {
    return this.projectRepository.findPublishedBySlug(slug);
  }

  findAll() {
    return this.projectRepository.findAll();
  }

  async create(input: CreateProjectDto) {
    await this.ensureSlugAvailable(input.slug);
    return this.projectRepository.create(input);
  }

  async update(id: string, input: UpdateProjectDto) {
    if (input.slug) await this.ensureSlugAvailable(input.slug, id);
    const project = await this.projectRepository.update(id, input);
    if (!project) throw new NotFoundException("Project not found.");
    return project;
  }

  async remove(id: string) {
    const removed = await this.projectRepository.remove(id);
    if (!removed) throw new NotFoundException("Project not found.");
  }

  private async ensureSlugAvailable(slug: string, currentId?: string) {
    const existing = await this.projectRepository.findBySlug(slug);
    if (existing && existing.id !== currentId) {
      throw new ConflictException("That project slug is already in use.");
    }
  }
}
