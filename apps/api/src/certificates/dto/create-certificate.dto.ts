import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from "class-validator";

export class CreateCertificateDto {
  @IsString() @MinLength(1) title!: string;
  @IsString() @MinLength(1) issuer!: string;
  @IsOptional() @IsString() credentialId?: string;
  @IsOptional() @IsUrl({ require_tld: false }) credentialUrl?: string;
  @IsOptional() @IsUrl({ require_tld: false }) imageUrl?: string;
  @IsOptional() @IsString() issuedAt?: string;
  @IsOptional() @IsString() expiresAt?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
