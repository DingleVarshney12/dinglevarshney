import { IsBoolean, IsString, Matches, MaxLength } from "class-validator";

export class SaveNoticeBannerDto {
  @IsBoolean() isEnabled!: boolean;
  @IsString() @MaxLength(240) text!: string;
  @IsString() @MaxLength(40) linkLabel!: string;
  @IsString() @MaxLength(500) linkUrl!: string;
  @Matches(/^#[0-9A-Fa-f]{6}$/) backgroundColor!: string;
}
