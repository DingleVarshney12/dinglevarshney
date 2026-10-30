import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioProfileEntity } from "../entities/portfolio-profile.entity.js";
import { SaveProfileDto } from "../dto/save-profile.dto.js";

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(PortfolioProfileEntity)
    private readonly repository: Repository<PortfolioProfileEntity>,
  ) {}
  findPublic() {
    return this.repository.findOne({ where: { isPublished: true }, order: { updatedAt: "DESC" } });
  }
  async findAdmin() {
    const [profile] = await this.repository.find({ order: { updatedAt: "DESC" }, take: 1 });
    return profile ?? null;
  }

  async save(input: SaveProfileDto) {
    const profile = await this.findAdmin();
    if (profile) this.repository.merge(profile, input);
    return this.repository.save(profile ?? this.repository.create(input));
  }
}
