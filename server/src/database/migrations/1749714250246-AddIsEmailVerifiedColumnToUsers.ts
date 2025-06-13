import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsEmailVerifiedColumnToUsers1749714250246
  implements MigrationInterface
{
  name = 'AddIsEmailVerifiedColumnToUsers1749714250246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "isEmailVerified"`,
    );
  }
}
