import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateMascotDialogueDto {
  @IsOptional() @IsString() @MinLength(1) question?: string;
  @IsOptional() @IsString() @MinLength(1) answer?: string;
  @IsOptional() @IsString() @MinLength(1) topic?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
