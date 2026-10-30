import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { ResumeEntryKind } from "@dinglevarshney/shared";

@Entity({ name: "resume_entries" })
export class ResumeEntryEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  kind!: ResumeEntryKind;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar", nullable: true })
  organization!: string | null;

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ name: "start_date", type: "varchar", nullable: true })
  startDate!: string | null;

  @Column({ name: "end_date", type: "varchar", nullable: true })
  endDate!: string | null;

  @Column({ type: "text", nullable: true })
  details!: string | null;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  bullets!: string[];

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
