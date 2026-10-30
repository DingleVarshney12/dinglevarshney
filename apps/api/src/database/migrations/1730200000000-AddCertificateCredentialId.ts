import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCertificateCredentialId1730200000000 implements MigrationInterface {
  name = "AddCertificateCredentialId1730200000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "certificates" ADD COLUMN "credential_id" varchar`);
    await queryRunner.query(
      `ALTER TABLE "certificates" ALTER COLUMN "credential_url" DROP NOT NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "certificates" SET "credential_url" = '' WHERE "credential_url" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ALTER COLUMN "credential_url" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "credential_id"`);
  }
}
