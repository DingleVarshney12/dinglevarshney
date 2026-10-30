import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPortfolioSchema1730110000000 implements MigrationInterface {
  name = "InitialPortfolioSchema1730110000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "slug" varchar NOT NULL UNIQUE,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "long_description" text,
        "category" varchar NOT NULL,
        "technologies" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "images" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "demo_url" text,
        "github_url" text,
        "role" varchar,
        "year" smallint,
        "featured" boolean NOT NULL DEFAULT false,
        "is_published" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_public_order" ON "projects" ("is_published", "featured", "sort_order")`,
    );

    await queryRunner.query(`
      CREATE TABLE "certificates" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "issuer" varchar NOT NULL,
        "credential_url" text NOT NULL,
        "image_url" text,
        "issued_at" date,
        "expires_at" date,
        "is_published" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_certificates_public_order" ON "certificates" ("is_published", "sort_order")`,
    );

    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "category" varchar NOT NULL,
        "level" varchar,
        "years_of_experience" double precision,
        "icon_url" text,
        "is_published" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_skills_public_category" ON "skills" ("is_published", "category", "sort_order")`,
    );

    await queryRunner.query(`
      CREATE TABLE "about_chapters" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "content" text NOT NULL,
        "year" smallint,
        "image_url" text,
        "is_published" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "portfolio_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "headline" varchar NOT NULL,
        "short_bio" text NOT NULL,
        "about" text NOT NULL,
        "avatar_url" text,
        "location" varchar,
        "email" varchar,
        "resume_url" text,
        "social_links" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "is_published" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "mascot_dialogues" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "question" text NOT NULL,
        "answer" text NOT NULL,
        "topic" varchar NOT NULL,
        "is_published" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "contact_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "message" text NOT NULL,
        "status" varchar NOT NULL DEFAULT 'new',
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact_messages"`);
    await queryRunner.query(`DROP TABLE "mascot_dialogues"`);
    await queryRunner.query(`DROP TABLE "portfolio_profiles"`);
    await queryRunner.query(`DROP TABLE "about_chapters"`);
    await queryRunner.query(`DROP INDEX "IDX_skills_public_category"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP INDEX "IDX_certificates_public_order"`);
    await queryRunner.query(`DROP TABLE "certificates"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_public_order"`);
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
