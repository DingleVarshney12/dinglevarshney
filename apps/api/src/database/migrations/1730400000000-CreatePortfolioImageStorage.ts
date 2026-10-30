import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePortfolioImageStorage1730400000000 implements MigrationInterface {
  name = "CreatePortfolioImageStorage1730400000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('portfolio-assets', 'portfolio-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
      ON CONFLICT (id) DO UPDATE SET
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types
    `);
    await queryRunner.query(`
      CREATE POLICY "portfolio_assets_public_read"
      ON storage.objects FOR SELECT TO public
      USING (bucket_id = 'portfolio-assets')
    `);
    await queryRunner.query(`
      CREATE POLICY "portfolio_assets_owner_upload"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'portfolio-assets' AND (storage.foldername(name))[1] = (select auth.uid()::text))
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP POLICY IF EXISTS "portfolio_assets_owner_upload" ON storage.objects`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "portfolio_assets_public_read" ON storage.objects`,
    );
    await queryRunner.query(
      `UPDATE storage.buckets SET public = false WHERE id = 'portfolio-assets'`,
    );
  }
}
