import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCelebrations1730500000000 implements MigrationInterface {
  name = "CreateCelebrations1730500000000";
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "celebrations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" varchar NOT NULL, "message" text NOT NULL, "effect" varchar NOT NULL, "accent_color" varchar NOT NULL DEFAULT '#f2bd52', "starts_at" TIMESTAMPTZ NOT NULL, "ends_at" TIMESTAMPTZ NOT NULL, "yearly" boolean NOT NULL DEFAULT false, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_celebrations_id" PRIMARY KEY ("id"))`,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "celebrations"`);
  }
}
