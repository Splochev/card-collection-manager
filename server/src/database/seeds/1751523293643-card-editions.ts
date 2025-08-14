import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface CardEditionData {
  'Card Number'?: string;
  'Set number'?: string;
  Name: string;
  Category?: string;
  Rarity?: string;
  'Collection Name': string;
}

export class CardEditions1751523293643 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.down(queryRunner);

    const seedFilesPath = path.join(
      __dirname,
      '..',
      'seed-files',
      'cards-mapping',
    );

    const parseJsonc = (filePath: string): CardEditionData[] => {
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanContent = content.replace(/\/\/.*$/gm, '');
      return JSON.parse(cleanContent) as CardEditionData[];
    };

    let allCardEditions: CardEditionData[] = [];

    const files = fs
      .readdirSync(seedFilesPath)
      .filter((file) => file.endsWith('.jsonc'));

    for (const file of files) {
      const filePath = path.join(seedFilesPath, file);
      const cardEditions = parseJsonc(filePath);
      allCardEditions.push(...cardEditions);
    }

    const problematicCards: CardEditionData[] = [];
    const cardEditionsChunks: CardEditionData[][] = [];
    const problematicCardsChunkSize = 5000;

    allCardEditions = this.validateCards(allCardEditions, problematicCards);

    for (
      let i = 0;
      i < allCardEditions.length;
      i += problematicCardsChunkSize
    ) {
      cardEditionsChunks.push(
        allCardEditions.slice(i, i + problematicCardsChunkSize),
      );
    }

    for (const chunk of cardEditionsChunks) {
      await this.insertCardEditions(queryRunner, chunk, problematicCards);
    }

    if (problematicCards.length > 0) {
      const problematicFilePath = path.join(
        seedFilesPath,
        'problematic-cards.jsonc',
      );
      fs.writeFileSync(
        problematicFilePath,
        JSON.stringify(problematicCards, null, 2),
      );
      console.warn(
        `Some cards were not inserted due to missing required fields. Check ${problematicFilePath} for details.`,
      );
    }
  }

  validateCards(
    cardEditions: CardEditionData[],
    problematicCards: CardEditionData[],
  ): CardEditionData[] {
    const uniqueCards: Record<string, CardEditionData> = {};

    for (const card of cardEditions) {
      const cardId = card['Card Number'] || card['Set number'];
      if (!cardId) {
        problematicCards.push(card);
        continue;
      }

      if (!uniqueCards[cardId]) {
        uniqueCards[cardId] = card;
      } else {
        problematicCards.push(card);
      }
    }

    return Object.values(uniqueCards);
  }

  async insertCardEditions(
    queryRunner: QueryRunner,
    cardEditions: CardEditionData[],
    problematicCards: CardEditionData[],
  ): Promise<void> {
    const values: string[] = [];
    const placeholders: string[] = [];

    for (const cardEdition of cardEditions) {
      const card_number =
        cardEdition['Card Number'] || cardEdition['Set number'];
      const name = cardEdition['Name'];
      const rarity = cardEdition['Rarity'];
      const category = cardEdition['Category'];
      const collectionName = cardEdition['Collection Name'];

      if (!card_number || !name || !rarity || !category || !collectionName) {
        problematicCards.push(cardEdition);
        continue;
      }

      values.push(card_number, name, rarity, category, collectionName);
      placeholders.push(
        `($${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`,
      );
    }

    await queryRunner.query(
      `
        INSERT INTO "card-editions" ("cardNumber", "name", "rarity", "category", "cardSetName")
        VALUES ${placeholders.join(', ')}
      `,
      values,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "card-editions"`);
  }
}
