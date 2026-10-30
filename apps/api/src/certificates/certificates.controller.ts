import { Controller, Get } from "@nestjs/common";
import { CertificatesService } from "./services/certificates.service.js";

@Controller("certificates")
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}
  @Get() findPublished() {
    return this.certificatesService.findPublished();
  }
}
