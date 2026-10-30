import { Controller, Get } from "@nestjs/common";
import { AboutChaptersService } from "./services/about-chapters.service.js";

@Controller("about/chapters")
export class AboutChaptersController {
  constructor(private readonly aboutChaptersService: AboutChaptersService) {}
  @Get() findPublished() {
    return this.aboutChaptersService.findPublished();
  }
}
