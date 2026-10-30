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
import { CreateMascotDialogueDto } from "./dto/create-mascot-dialogue.dto.js";
import { UpdateMascotDialogueDto } from "./dto/update-mascot-dialogue.dto.js";
import { MascotDialoguesService } from "./services/mascot-dialogues.service.js";

@Controller("admin/mascot-dialogues")
@UseGuards(SupabaseAdminGuard)
export class AdminMascotDialoguesController {
  constructor(private readonly mascotDialoguesService: MascotDialoguesService) {}

  @Get()
  findAll() {
    return this.mascotDialoguesService.findAll();
  }

  @Post()
  create(@Body() input: CreateMascotDialogueDto) {
    return this.mascotDialoguesService.create(input);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() input: UpdateMascotDialogueDto) {
    return this.mascotDialoguesService.update(id, input);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.mascotDialoguesService.remove(id);
  }
}
