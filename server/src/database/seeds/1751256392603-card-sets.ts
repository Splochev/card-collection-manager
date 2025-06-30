import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface CardSetData {
  name: string;
  abbreviations: string[];
  isMissing?: boolean;
}

export class CardSets1751256392603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const missingCardSets = (
      await queryRunner.query(`
      SELECT * FROM "cardSets" WHERE "isMissing" = true
    `)
    ).map((set: CardSetData) => ({
      name: set.name,
      abbreviations: set.abbreviations,
      isMissing: set.isMissing,
    })) as CardSetData[];

    await this.down(queryRunner);

    const seedFilesPath = path.join(__dirname, '..', 'seed-files', 'card-sets');

    const boostersPath = path.join(seedFilesPath, 'boosters.jsonc');
    const decksPath = path.join(seedFilesPath, 'decks.jsonc');
    const promosPath = path.join(seedFilesPath, 'promos.jsonc');

    const parseJsonc = (filePath: string): CardSetData[] => {
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanContent = content.replace(/\/\/.*$/gm, '');
      return JSON.parse(cleanContent) as CardSetData[];
    };

    const boostersData = parseJsonc(boostersPath);
    const decksData = parseJsonc(decksPath);
    const promosData = parseJsonc(promosPath);

    const allCardSets = [
      ...boostersData,
      ...decksData,
      ...promosData,
      ...missingCardSets,
    ];
    const values: string[] = [];
    const placeholders: string[] = [];

    for (const cardSet of allCardSets) {
      const { name, abbreviations, isMissing } = cardSet;

      values.push(
        name,
        JSON.stringify(abbreviations),
        String(Boolean(isMissing ?? false)),
      );
      placeholders.push(
        `($${values.length - 2}, $${values.length - 1}, $${values.length})`,
      );
    }

    await queryRunner.query(
      `
        INSERT INTO "cardSets" ("name", "abbreviations", "isMissing") 
        VALUES ${placeholders.join(', ')}
      `,
      values,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "cardSets"`);
  }
}
