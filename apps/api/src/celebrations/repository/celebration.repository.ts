import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CelebrationEntity } from "../entities/celebration.entity.js";

@Injectable()
export class CelebrationRepository {
  constructor(@InjectRepository(CelebrationEntity) private readonly repository: Repository<CelebrationEntity>) {}
  findAll() { return this.repository.find({ order: { startsAt: "DESC" } }); }
  findActive(now: Date) { return this.repository.find({ where: { isEnabled: true }, order: { startsAt: "ASC" } }).then((items) => items.find((item) => isActive(item, now)) ?? null); }
  save(input: Partial<CelebrationEntity>) { return this.repository.save(input); }
  async remove(id: string) { await this.repository.delete(id); }
}

function isActive(item: CelebrationEntity, now: Date) {
  if (!item.yearly) return item.startsAt <= now && item.endsAt >= now;
  const start = new Date(item.startsAt);
  const end = new Date(item.endsAt);
  const startThisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
  const endThisYear = new Date(now.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes());
  return startThisYear <= now && endThisYear >= now;
}
