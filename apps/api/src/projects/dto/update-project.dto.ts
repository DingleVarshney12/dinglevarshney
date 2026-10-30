import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";

export class UpdateProjectDto {
  @IsOptional() @IsString() @MinLength(1) slug?: string;
  @IsOptional() @IsString() @MinLength(1) title?: string;
  @IsOptional() @IsString() @MinLength(1) description?: string;
  @IsOptional() @IsString() longDescription?: string | null;
  @IsOptional() @IsString() @MinLength(1) category?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) technologies?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsUrl({ require_tld: false }) demoUrl?: string | null;
  @IsOptional() @IsUrl({ require_tld: false }) githubUrl?: string | null;
  @IsOptional() @IsString() role?: string | null;
  @IsOptional() @IsInt() @Min(1900) year?: number | null;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
