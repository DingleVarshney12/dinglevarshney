import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "../repository/profile.repository.js";
import { SaveProfileDto } from "../dto/save-profile.dto.js";

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}
  findPublic() {
    return this.profileRepository.findPublic();
  }
  findAdmin() {
    return this.profileRepository.findAdmin();
  }
  save(input: SaveProfileDto) {
    return this.profileRepository.save(input);
  }
}
