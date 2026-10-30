import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import type { ResumeEntryKind } from "@dinglevarshney/shared";

const entryKinds: ResumeEntryKind[] = [
  "education",
  "experience",
  "activity",
  "language",
  "interest",
];

export class SaveResumeEntryDto {
  @IsIn(entryKinds) kind!: ResumeEntryKind;
  @IsString() @MinLength(1) title!: string;
  @IsOptional() @IsString() organization?: string | null;
  @IsOptional() @IsString() location?: string | null;
  @IsOptional() @IsString() startDate?: string | null;
  @IsOptional() @IsString() endDate?: string | null;
  @IsOptional() @IsString() details?: string | null;
  @IsArray() @IsString({ each: true }) bullets!: string[];
  @IsBoolean() isPublished!: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class UpdateResumeEntryDto {
  @IsOptional() @IsIn(entryKinds) kind?: ResumeEntryKind;
  @IsOptional() @IsString() @MinLength(1) title?: string;
  @IsOptional() @IsString() organization?: string | null;
  @IsOptional() @IsString() location?: string | null;
  @IsOptional() @IsString() startDate?: string | null;
  @IsOptional() @IsString() endDate?: string | null;
  @IsOptional() @IsString() details?: string | null;
  @IsOptional() @IsArray() @IsString({ each: true }) bullets?: string[];
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
