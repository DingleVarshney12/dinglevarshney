import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { SaveProfileDto } from "./dto/save-profile.dto.js";
import { ProfileService } from "./services/profile.service.js";

@Controller("admin/profile")
@UseGuards(SupabaseAdminGuard)
export class AdminProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAdmin() {
    return this.profileService.findAdmin();
  }

  @Put()
  save(@Body() input: SaveProfileDto) {
    return this.profileService.save(input);
  }
}
