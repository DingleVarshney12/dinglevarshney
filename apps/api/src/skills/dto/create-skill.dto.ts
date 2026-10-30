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

export class CreateSkillDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() @MinLength(1) category!: string;
  @IsOptional() @IsIn(["Beginner", "Intermediate", "Advanced", "Expert"]) level?: string;
  @IsOptional() @IsNumber() @Min(0) yearsOfExperience?: number;
  @IsOptional() @IsString() iconUrl?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
