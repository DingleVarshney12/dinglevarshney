import { Injectable, NotFoundException } from "@nestjs/common";
import { AboutChapterRepository } from "../repository/about-chapter.repository.js";
import { CreateAboutChapterDto } from "../dto/create-about-chapter.dto.js";
import { UpdateAboutChapterDto } from "../dto/update-about-chapter.dto.js";

@Injectable()
export class AboutChaptersService {
  constructor(private readonly aboutChapterRepository: AboutChapterRepository) {}
  findPublished() {
    return this.aboutChapterRepository.findPublished();
  }

  findAll() {
    return this.aboutChapterRepository.findAll();
  }

  create(input: CreateAboutChapterDto) {
    return this.aboutChapterRepository.create(input);
  }

  async update(id: string, input: UpdateAboutChapterDto) {
    const chapter = await this.aboutChapterRepository.update(id, input);
    if (!chapter) throw new NotFoundException("About chapter not found.");
    return chapter;
  }

  async remove(id: string) {
    const removed = await this.aboutChapterRepository.remove(id);
    if (!removed) throw new NotFoundException("About chapter not found.");
  }
}
