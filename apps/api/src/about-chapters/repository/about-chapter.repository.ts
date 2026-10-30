import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AboutChapterEntity } from "../entities/about-chapter.entity.js";
import { CreateAboutChapterDto } from "../dto/create-about-chapter.dto.js";
import { UpdateAboutChapterDto } from "../dto/update-about-chapter.dto.js";

@Injectable()
export class AboutChapterRepository {
  constructor(
    @InjectRepository(AboutChapterEntity)
    private readonly repository: Repository<AboutChapterEntity>,
  ) {}
  findPublished() {
    return this.repository.find({
      where: { isPublished: true },
      order: { sortOrder: "ASC" },
    });
  }

  findAll() {
    return this.repository.find({
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });
  }

  create(input: CreateAboutChapterDto) {
    const chapter = this.repository.create({
      ...input,
      year: input.year ?? null,
      imageUrl: input.imageUrl ?? null,
      isPublished: input.isPublished ?? false,
      sortOrder: input.sortOrder ?? 0,
    });
    return this.repository.save(chapter);
  }

  async update(id: string, input: UpdateAboutChapterDto) {
    const chapter = await this.repository.findOneBy({ id });
    if (!chapter) return null;
    this.repository.merge(chapter, input);
    return this.repository.save(chapter);
  }

  async remove(id: string) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
