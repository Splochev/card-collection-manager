import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1749713985984 implements MigrationInterface {
  name = 'CreateUsersTable1749713985984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('1');
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
