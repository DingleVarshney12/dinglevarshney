import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateMascotDialogueDto {
  @IsString() @MinLength(1) question!: string;
  @IsString() @MinLength(1) answer!: string;
  @IsString() @MinLength(1) topic!: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
