import { Controller, Get, NotFoundException } from "@nestjs/common";
import { ProfileService } from "./services/profile.service.js";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  async findPublic() {
    const profile = await this.profileService.findPublic();
    if (!profile) throw new NotFoundException("Portfolio profile not found");
    return profile;
  }
}
