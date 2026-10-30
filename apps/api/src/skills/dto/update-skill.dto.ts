import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class UpdateSkillDto {
  @IsOptional() @IsString() @MinLength(1) name?: string;
  @IsOptional() @IsString() @MinLength(1) category?: string;
  @IsOptional() @IsIn(["Beginner", "Intermediate", "Advanced", "Expert"]) level?: string | null;
  @IsOptional() @IsNumber() @Min(0) yearsOfExperience?: number | null;
  @IsOptional() @IsString() iconUrl?: string | null;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
