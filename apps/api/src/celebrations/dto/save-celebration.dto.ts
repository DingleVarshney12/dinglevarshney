import {
  IsBoolean,
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
} from "class-validator";

export class SaveCelebrationDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @MaxLength(80)
  name!: string;

  @IsString()
  @MaxLength(180)
  message!: string;

  @IsIn(["coins", "petals", "confetti", "lights"])
  effect!: string;

  @Matches(/^#[0-9A-Fa-f]{6}$/)
  accentColor!: string;

  @IsISO8601()
  startsAt!: string;

  @IsISO8601()
  endsAt!: string;

  @IsBoolean()
  yearly!: boolean;

  @IsBoolean()
  isEnabled!: boolean;
}
