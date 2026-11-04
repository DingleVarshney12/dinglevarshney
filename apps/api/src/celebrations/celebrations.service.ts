import { Injectable, NotFoundException } from "@nestjs/common";
import { CelebrationRepository } from "./repository/celebration.repository.js";
import { SaveCelebrationDto } from "./dto/save-celebration.dto.js";

@Injectable()
export class CelebrationsService {
  constructor(private readonly repository: CelebrationRepository) {}
  findAll() { return this.repository.findAll(); }
  findActive() { return this.repository.findActive(new Date()); }
  save(input: SaveCelebrationDto) { return this.repository.save({ ...input, startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt) }); }
  async remove(id: string) {
    const existing = (await this.repository.findAll()).find((item) => item.id === id);
    if (!existing) throw new NotFoundException("Celebration not found");
    await this.repository.remove(id);
  }
}
