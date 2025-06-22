import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
export class DefaultUser1749675347730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultUserEmail = process.env.DEFAULT_USER_EMAIL;
    const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;

    if (!defaultUserEmail || !defaultUserPassword) {
      throw new Error(
        'Environment variables DEFAULT_USER_EMAIL and DEFAULT_USER_PASSWORD must be set',
      );
    }

    const hashedPassword = await bcrypt.hash(defaultUserPassword, 10);

    await queryRunner.query(
      `INSERT INTO "users" ("id", "email", "password", "isVerified", "firstName", "lastName", "role")
      VALUES (1, $1, $2, true, 'Stanislav', 'Plochev', 'admin')
      ON CONFLICT ("id") DO UPDATE
      SET "email" = EXCLUDED."email", "password" = EXCLUDED."password", "isVerified" = true, "firstName" = 'Stanislav', "lastName" = 'Plochev', "role" = 'admin'`,
      [defaultUserEmail, hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE "id" = 1`);
  }
}
