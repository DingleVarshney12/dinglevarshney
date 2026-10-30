import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";
import { CreateAboutChapterDto } from "./dto/create-about-chapter.dto.js";
import { UpdateAboutChapterDto } from "./dto/update-about-chapter.dto.js";
import { AboutChaptersService } from "./services/about-chapters.service.js";

@Controller("admin/about/chapters")
@UseGuards(SupabaseAdminGuard)
export class AdminAboutChaptersController {
  constructor(private readonly aboutChaptersService: AboutChaptersService) {}

  @Get()
  findAll() {
    return this.aboutChaptersService.findAll();
  }

  @Post()
  create(@Body() input: CreateAboutChapterDto) {
    return this.aboutChaptersService.create(input);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() input: UpdateAboutChapterDto) {
    return this.aboutChaptersService.update(id, input);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.aboutChaptersService.remove(id);
  }
}
