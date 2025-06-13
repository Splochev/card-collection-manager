import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnIsEmailVerifiedToIsVerified1749715437974
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "isEmailVerified" TO "isVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isVerified" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isVerified" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "isVerified" TO "isEmailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isEmailVerified" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "isEmailVerified" DROP NOT NULL`,
    );
  }
}
