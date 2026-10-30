import { Injectable, NotFoundException } from "@nestjs/common";
import { CertificateRepository } from "../repository/certificate.repository.js";
import { CreateCertificateDto } from "../dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "../dto/update-certificate.dto.js";

@Injectable()
export class CertificatesService {
  constructor(private readonly certificateRepository: CertificateRepository) {}
  findPublished() {
    return this.certificateRepository.findPublished();
  }
  findAll() {
    return this.certificateRepository.findAll();
  }
  create(input: CreateCertificateDto) {
    return this.certificateRepository.create(input);
  }
  async update(id: string, input: UpdateCertificateDto) {
    const certificate = await this.certificateRepository.update(id, input);
    if (!certificate) throw new NotFoundException("Certificate not found.");
    return certificate;
  }
  async remove(id: string) {
    if (!(await this.certificateRepository.remove(id)))
      throw new NotFoundException("Certificate not found.");
  }
}
