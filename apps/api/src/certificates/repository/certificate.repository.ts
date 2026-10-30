import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CertificateEntity } from "../entities/certificate.entity.js";
import { CreateCertificateDto } from "../dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "../dto/update-certificate.dto.js";

@Injectable()
export class CertificateRepository {
  constructor(
    @InjectRepository(CertificateEntity) private readonly repository: Repository<CertificateEntity>,
  ) {}
  findPublished() {
    return this.repository.find({
      where: { isPublished: true },
      order: { sortOrder: "ASC", issuedAt: "DESC" },
    });
  }
  findAll() {
    return this.repository.find({
      order: { sortOrder: "ASC", issuedAt: "DESC", createdAt: "DESC" },
    });
  }
  create(input: CreateCertificateDto) {
    return this.repository.save(
      this.repository.create({
        ...input,
        credentialId: input.credentialId ?? null,
        credentialUrl: input.credentialUrl ?? null,
        imageUrl: input.imageUrl ?? null,
        issuedAt: input.issuedAt ?? null,
        expiresAt: input.expiresAt ?? null,
        isPublished: input.isPublished ?? false,
        sortOrder: input.sortOrder ?? 0,
      }),
    );
  }
  async update(id: string, input: UpdateCertificateDto) {
    const certificate = await this.repository.findOneBy({ id });
    if (!certificate) return null;
    this.repository.merge(certificate, input);
    return this.repository.save(certificate);
  }
  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
