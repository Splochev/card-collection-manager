import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface CardEditionData {
  card_number: string;
  name: string;
  cardSetName: string;

  print?: string;
  rarity?: string;
  category?: string;
  uniqueKey?: string;
  cardSetCode?: string;
  invalidField?: 'card_number' | 'name' | 'cardSetName';
}

export class CardEditions1751523293643 implements MigrationInterface {
  private validateCardEditions(data: CardEditionData[]): CardEditionData[] {
    const seen = new Set<string>();
    const validData: CardEditionData[] = [];
    const invalidCardSets: {
      [key: string]: {
        empty: CardEditionData[];
        duplicates: CardEditionData[];
        invalidPrints: CardEditionData[];
        invalidRarities: CardEditionData[];
        invalidCategories: CardEditionData[];
      };
    } = {};
    let allIsValid = true;

    const printSetCodes = new Set<string>([]);
    const raritySetCodes = new Set<string>([]);
    const categorySetCodes = new Set<string>([]);

    const initInvalidCardSets = () => {
      return {
        empty: [] as CardEditionData[],
        duplicates: [] as CardEditionData[],
        invalidPrints: [] as CardEditionData[],
        invalidRarities: [] as CardEditionData[],
        invalidCategories: [] as CardEditionData[],
      };
    };

    for (const item of data) {
      const { card_number, name, cardSetName, print, rarity, category } = item;

      printSetCodes.add(print || '');
      raritySetCodes.add(rarity || '');
      categorySetCodes.add(category || '');

      if (!card_number || !name || !cardSetName) {
        invalidCardSets[cardSetName] =
          invalidCardSets[cardSetName] || initInvalidCardSets();
        item.cardSetCode = cardSetName;
        invalidCardSets[cardSetName].empty.push(item);
        allIsValid = false;
        continue;
      }

      const uniqueKey = `${card_number}-${name}`;

      if (seen.has(uniqueKey)) {
        invalidCardSets[cardSetName] =
          invalidCardSets[cardSetName] || initInvalidCardSets();
        item.uniqueKey = uniqueKey;
        item.cardSetCode = cardSetName;
        invalidCardSets[cardSetName].duplicates.push(item);
        allIsValid = false;
        continue;
      }

      seen.add(uniqueKey);
      validData.push(item);
    }

    if (!allIsValid) {
      // eslint-disable-next-line no-debugger
      debugger;
      throw new Error(`Invalid card sets found`);
    }

    validData.forEach((item) => {
      const { card_number, name, cardSetName } = item;

      if (
        printSetCodes.has(card_number) ||
        printSetCodes.has(name) ||
        printSetCodes.has(cardSetName)
      ) {
        invalidCardSets[cardSetName] =
          invalidCardSets[cardSetName] || initInvalidCardSets();
        allIsValid = false;

        if (printSetCodes.has(card_number)) {
          invalidCardSets[cardSetName].invalidPrints.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'card_number',
          });
        } else if (printSetCodes.has(name)) {
          invalidCardSets[cardSetName].invalidPrints.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'name',
          });
        } else if (printSetCodes.has(cardSetName)) {
          invalidCardSets[cardSetName].invalidPrints.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'cardSetName',
          });
        }
      } else if (
        raritySetCodes.has(card_number) ||
        raritySetCodes.has(name) ||
        raritySetCodes.has(cardSetName)
      ) {
        invalidCardSets[cardSetName] =
          invalidCardSets[cardSetName] || initInvalidCardSets();
        allIsValid = false;

        if (raritySetCodes.has(card_number)) {
          invalidCardSets[cardSetName].invalidRarities.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'card_number',
          });
        } else if (raritySetCodes.has(name)) {
          invalidCardSets[cardSetName].invalidRarities.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'name',
          });
        } else if (raritySetCodes.has(cardSetName)) {
          invalidCardSets[cardSetName].invalidRarities.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'cardSetName',
          });
        }
      } else if (
        categorySetCodes.has(card_number) ||
        categorySetCodes.has(name) ||
        categorySetCodes.has(cardSetName)
      ) {
        invalidCardSets[cardSetName] =
          invalidCardSets[cardSetName] || initInvalidCardSets();
        allIsValid = false;

        if (categorySetCodes.has(card_number)) {
          invalidCardSets[cardSetName].invalidCategories.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'card_number',
          });
        } else if (categorySetCodes.has(name)) {
          invalidCardSets[cardSetName].invalidCategories.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'name',
          });
        } else if (categorySetCodes.has(cardSetName)) {
          invalidCardSets[cardSetName].invalidCategories.push({
            card_number,
            name,
            cardSetName,
            invalidField: 'cardSetName',
          });
        }
      }
    });

    if (!allIsValid) {
      // eslint-disable-next-line no-debugger
      debugger;
      throw new Error(`Invalid card sets found`);
    }

    return validData;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.down(queryRunner);

    const seedFilesPath = path.join(
      __dirname,
      '..',
      'seed-files',
      'card-sets-mapping',
    );

    const parseJsonc = (filePath: string): CardEditionData[] => {
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanContent = content.replace(/\/\/.*$/gm, '');
      return JSON.parse(cleanContent) as CardEditionData[];
    };

    const allCardEditions: CardEditionData[] = [];

    const files = fs
      .readdirSync(seedFilesPath)
      .filter((file) => file.endsWith('.jsonc'));
    for (const file of files) {
      const filePath = path.join(seedFilesPath, file);
      const cardEditions = parseJsonc(filePath);
      allCardEditions.push(...cardEditions);
    }

    const validatedCardEditions = this.validateCardEditions(allCardEditions);

    const values: string[] = [];
    const placeholders: string[] = [];

    for (const cardEdition of validatedCardEditions) {
      const { card_number, name, cardSetName } = cardEdition;

      values.push(card_number, name, cardSetName);
      placeholders.push(
        `($${values.length - 2}, $${values.length - 1}, $${values.length})`,
      );
    }

    await queryRunner.query(
      `
        INSERT INTO "card-editions" ("cardNumber", "name", "cardSetName")
        VALUES ${placeholders.join(', ')}
      `,
      values,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "card-editions"`);
  }
}
