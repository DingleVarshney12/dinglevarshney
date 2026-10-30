import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "certificates" })
export class CertificateEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  issuer!: string;

  @Column({ name: "credential_id", type: "varchar", nullable: true })
  credentialId!: string | null;

  @Column({ name: "credential_url", type: "text", nullable: true })
  credentialUrl!: string | null;

  @Column({ name: "image_url", type: "text", nullable: true })
  imageUrl!: string | null;

  @Column({ name: "issued_at", type: "date", nullable: true })
  issuedAt!: string | null;

  @Column({ name: "expires_at", type: "date", nullable: true })
  expiresAt!: string | null;

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
