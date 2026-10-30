import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddResumeContent1730300000000 implements MigrationInterface {
  name = "AddResumeContent1730300000000";
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolio_profiles" ADD COLUMN "phone" varchar`);
    await queryRunner.query(
      `CREATE TABLE "resume_entries" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "kind" varchar NOT NULL, "title" varchar NOT NULL, "organization" varchar, "location" varchar, "start_date" varchar, "end_date" varchar, "details" text, "bullets" jsonb NOT NULL DEFAULT '[]'::jsonb, "is_published" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_resume_entries_id" PRIMARY KEY ("id"))`,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "resume_entries"`);
    await queryRunner.query(`ALTER TABLE "portfolio_profiles" DROP COLUMN "phone"`);
  }
}
