import { Controller, Delete, Get, Param, Put, Body, UseGuards } from "@nestjs/common";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { SaveCelebrationDto } from "./dto/save-celebration.dto.js";
import { CelebrationsService } from "./celebrations.service.js";

@Controller()
export class CelebrationsController {
  constructor(private readonly service: CelebrationsService) {}
  @Get("celebration") findActive() { return this.service.findActive(); }
  @Get("admin/celebrations") @UseGuards(SupabaseAdminGuard) findAll() { return this.service.findAll(); }
  @Put("admin/celebrations") @UseGuards(SupabaseAdminGuard) save(@Body() input: SaveCelebrationDto) { return this.service.save(input); }
  @Delete("admin/celebrations/:id") @UseGuards(SupabaseAdminGuard) remove(@Param("id") id: string) { return this.service.remove(id); }
}
