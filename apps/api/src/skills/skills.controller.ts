import { Controller, Get, Query } from "@nestjs/common";
import { SkillsService } from "./services/skills.service.js";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}
  @Get() findPublished(@Query("category") category?: string) {
    return this.skillsService.findPublished(category);
  }
}
