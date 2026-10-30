import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "projects" })
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "long_description", type: "text", nullable: true })
  longDescription!: string | null;

  @Column()
  category!: string;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  technologies!: string[];

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  images!: string[];

  @Column({ name: "demo_url", type: "text", nullable: true })
  demoUrl!: string | null;

  @Column({ name: "github_url", type: "text", nullable: true })
  githubUrl!: string | null;

  @Column({ type: "varchar", nullable: true })
  role!: string | null;

  @Column({ type: "smallint", nullable: true })
  year!: number | null;

  @Column({ default: false })
  featured!: boolean;

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
