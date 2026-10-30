import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ProjectsService } from "./services/projects.service.js";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findPublished(@Query("category") category?: string) {
    return this.projectsService.findPublished(category);
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    const project = await this.projectsService.findBySlug(slug);
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }
}
