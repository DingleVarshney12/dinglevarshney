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
import { CreateCertificateDto } from "./dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "./dto/update-certificate.dto.js";
import { CertificatesService } from "./services/certificates.service.js";

@Controller("admin/certificates")
@UseGuards(SupabaseAdminGuard)
export class AdminCertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Post()
  create(@Body() input: CreateCertificateDto) {
    return this.certificatesService.create(input);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() input: UpdateCertificateDto) {
    return this.certificatesService.update(id, input);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.certificatesService.remove(id);
  }
}
