import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

const socialPlatforms = [
  "github",
  "linkedin",
  "instagram",
  "youtube",
  "x",
  "website",
  "leetcode",
  "other",
] as const;

class SocialLinkDto {
  @IsString() @MinLength(1) id!: string;
  @IsString() @MinLength(1) label!: string;
  @IsIn(socialPlatforms) platform!: (typeof socialPlatforms)[number];
  @IsUrl({ require_tld: false }) url!: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class SaveProfileDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() @MinLength(1) headline!: string;
  @IsString() @MinLength(1) shortBio!: string;
  @IsString() @MinLength(1) about!: string;
  @IsOptional() @IsUrl({ require_tld: false }) avatarUrl?: string | null;
  @IsOptional() @IsString() location?: string | null;
  @IsOptional() @IsEmail() email?: string | null;
  @IsOptional() @IsString() phone?: string | null;
  @IsOptional() @IsUrl({ require_tld: false }) resumeUrl?: string | null;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks!: SocialLinkDto[];
  @IsBoolean() isPublished!: boolean;
}
