import { MigrationInterface, QueryRunner } from 'typeorm';

// TODO delete this
export class DefaultUser1749675347730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "users" 
      ("id", "email", "password") 
      VALUES (1, 'admin', 'admin') ON CONFLICT ("id") DO NOTHING`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "id" = 1`);
  }
}
