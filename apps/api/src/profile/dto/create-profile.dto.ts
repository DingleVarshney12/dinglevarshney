import { IsArray, IsEmail, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import type { SocialLink } from "@dinglevarshney/shared";

export class CreateProfileDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() @MinLength(1) headline!: string;
  @IsString() @MinLength(1) shortBio!: string;
  @IsString() @MinLength(1) about!: string;
  @IsOptional() @IsUrl({ require_tld: false }) avatarUrl?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsUrl({ require_tld: false }) resumeUrl?: string;
  @IsArray() socialLinks!: SocialLink[];
}
