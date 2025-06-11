import { MigrationInterface, QueryRunner } from 'typeorm';

// TODO delete this
export class Users1749675060754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" SERIAL NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            CONSTRAINT "UQ_email" UNIQUE ("email"),
            CONSTRAINT "PK_id" PRIMARY KEY ("id")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
