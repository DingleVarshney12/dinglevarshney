import { Controller, Get } from "@nestjs/common";
import { ResumeContentService } from "./services/resume-content.service.js";

@Controller("resume-content")
export class ResumeContentController {
  constructor(private readonly resumeContentService: ResumeContentService) {}
  @Get() findPublished() {
    return this.resumeContentService.findPublished();
  }
}
