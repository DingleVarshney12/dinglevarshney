import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntity } from "../entities/project.entity.js";
import { CreateProjectDto } from "../dto/create-project.dto.js";
import { UpdateProjectDto } from "../dto/update-project.dto.js";

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repository: Repository<ProjectEntity>,
  ) {}

  findPublished(category?: string) {
    return this.repository.find({
      where: category ? { isPublished: true, category } : { isPublished: true },
      order: { featured: "DESC", sortOrder: "ASC", createdAt: "DESC" },
    });
  }

  findPublishedBySlug(slug: string) {
    return this.repository.findOne({ where: { slug, isPublished: true } });
  }

  findAll() {
    return this.repository.find({
      order: { sortOrder: "ASC", createdAt: "DESC" },
    });
  }

  findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  create(input: CreateProjectDto) {
    const project = this.repository.create({
      ...input,
      longDescription: input.longDescription ?? null,
      technologies: input.technologies ?? [],
      images: input.images ?? [],
      demoUrl: input.demoUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      role: input.role ?? null,
      year: input.year ?? null,
      featured: input.featured ?? false,
      isPublished: input.isPublished ?? false,
      sortOrder: input.sortOrder ?? 0,
    });
    return this.repository.save(project);
  }

  async update(id: string, input: UpdateProjectDto) {
    const project = await this.repository.findOneBy({ id });
    if (!project) return null;
    this.repository.merge(project, input);
    return this.repository.save(project);
  }

  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
