import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateAboutChapterDto {
  @IsString() @MinLength(1) title!: string;
  @IsString() @MinLength(1) content!: string;
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
