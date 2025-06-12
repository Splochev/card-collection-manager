import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstNameToUsers1749716610119 implements MigrationInterface {
  name = 'AddFirstNameToUsers1749716610119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
  }
}
