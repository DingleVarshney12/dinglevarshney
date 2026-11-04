import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoticeBanner1730600000000 implements MigrationInterface {
  name = "CreateNoticeBanner1730600000000";
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "notice_banner" ("id" varchar NOT NULL DEFAULT 'main', "is_enabled" boolean NOT NULL DEFAULT false, "text" text NOT NULL DEFAULT '', "link_label" varchar NOT NULL DEFAULT '', "link_url" text NOT NULL DEFAULT '', "background_color" varchar NOT NULL DEFAULT '#173b3a', "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_notice_banner" PRIMARY KEY ("id"))`);
  }
  async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.query(`DROP TABLE "notice_banner"`); }
}
