import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "skills" })
export class SkillEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column({ type: "varchar", nullable: true })
  level!: string | null;

  @Column({ name: "years_of_experience", type: "double precision", nullable: true })
  yearsOfExperience!: number | null;

  @Column({ name: "icon_url", type: "text", nullable: true })
  iconUrl!: string | null;

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
