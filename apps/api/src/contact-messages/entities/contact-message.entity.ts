import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { ContactMessageStatus } from "@dinglevarshney/shared";

@Entity({ name: "contact_messages" })
export class ContactMessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", default: "new" })
  status!: ContactMessageStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
