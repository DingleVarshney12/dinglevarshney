import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "notice_banner" })
export class NoticeBannerEntity {
  @PrimaryColumn({ type: "varchar", length: 20 })
  id = "main";
  @Column({ name: "is_enabled", default: false }) isEnabled!: boolean;
  @Column({ type: "text", default: "" }) text!: string;
  @Column({ name: "link_label", default: "" }) linkLabel!: string;
  @Column({ name: "link_url", type: "text", default: "" }) linkUrl!: string;
  @Column({ name: "background_color", default: "#173b3a" }) backgroundColor!: string;
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" }) updatedAt!: Date;
}
