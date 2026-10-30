import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { CreateSkillDto } from "./dto/create-skill.dto.js";
import { UpdateSkillDto } from "./dto/update-skill.dto.js";
import { SkillsService } from "./services/skills.service.js";

@Controller("admin/skills")
@UseGuards(SupabaseAdminGuard)
export class AdminSkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  create(@Body() input: CreateSkillDto) {
    return this.skillsService.create(input);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() input: UpdateSkillDto) {
    return this.skillsService.update(id, input);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.skillsService.remove(id);
  }
}
