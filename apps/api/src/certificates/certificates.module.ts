import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CertificateEntity } from "./entities/certificate.entity.js";
import { CertificatesController } from "./certificates.controller.js";
import { CertificateRepository } from "./repository/certificate.repository.js";
import { CertificatesService } from "./services/certificates.service.js";
import { AdminCertificatesController } from "./admin-certificates.controller.js";
import { SupabaseAdminGuard } from "../common/guards/supabase-admin.guard.js";

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity])],
  controllers: [CertificatesController, AdminCertificatesController],
  providers: [CertificateRepository, CertificatesService, SupabaseAdminGuard],
  exports: [CertificatesService],
})
export class CertificatesModule {}
