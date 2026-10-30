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
import { SaveResumeEntryDto, UpdateResumeEntryDto } from "./dto/save-resume-entry.dto.js";
import { ResumeContentService } from "./services/resume-content.service.js";

@Controller("admin/resume-content")
@UseGuards(SupabaseAdminGuard)
export class AdminResumeContentController {
  constructor(private readonly resumeContentService: ResumeContentService) {}
  @Get() findAll() {
    return this.resumeContentService.findAll();
  }
  @Post() create(@Body() input: SaveResumeEntryDto) {
    return this.resumeContentService.create(input);
  }
  @Patch(":id") update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() input: UpdateResumeEntryDto,
  ) {
    return this.resumeContentService.update(id, input);
  }
  @Delete(":id") @HttpCode(HttpStatus.NO_CONTENT) remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.resumeContentService.remove(id);
  }
}
