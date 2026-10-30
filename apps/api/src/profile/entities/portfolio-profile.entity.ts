import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { SocialLink } from "@dinglevarshney/shared";

@Entity({ name: "portfolio_profiles" })
export class PortfolioProfileEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  headline!: string;

  @Column({ name: "short_bio", type: "text" })
  shortBio!: string;

  @Column({ type: "text" })
  about!: string;

  @Column({ name: "avatar_url", type: "text", nullable: true })
  avatarUrl!: string | null;

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ type: "varchar", nullable: true })
  email!: string | null;

  @Column({ type: "varchar", nullable: true })
  phone!: string | null;

  @Column({ name: "resume_url", type: "text", nullable: true })
  resumeUrl!: string | null;

  @Column({ name: "social_links", type: "jsonb", default: () => "'[]'::jsonb" })
  socialLinks!: SocialLink[];

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
