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

export class CreateProjectDto {
  @IsString() @MinLength(1) slug!: string;
  @IsString() @MinLength(1) title!: string;
  @IsString() @MinLength(1) description!: string;
  @IsOptional() @IsString() longDescription?: string;
  @IsString() @MinLength(1) category!: string;
  @IsArray() @IsString({ each: true }) technologies!: string[];
  @IsArray() @IsString({ each: true }) images!: string[];
  @IsOptional() @IsUrl({ require_tld: false }) demoUrl?: string;
  @IsOptional() @IsUrl({ require_tld: false }) githubUrl?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsInt() @Min(1900) year?: number;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
