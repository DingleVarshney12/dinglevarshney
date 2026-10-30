import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from "class-validator";

export class UpdateCertificateDto {
  @IsOptional() @IsString() @MinLength(1) title?: string;
  @IsOptional() @IsString() @MinLength(1) issuer?: string;
  @IsOptional() @IsString() credentialId?: string | null;
  @IsOptional() @IsUrl({ require_tld: false }) credentialUrl?: string | null;
  @IsOptional() @IsUrl({ require_tld: false }) imageUrl?: string | null;
  @IsOptional() @IsString() issuedAt?: string | null;
  @IsOptional() @IsString() expiresAt?: string | null;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
