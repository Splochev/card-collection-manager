import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  CardApiResponse,
  ICard,
  ScrapeCardDto,
} from 'src/interfaces/cards/CardApiResponse.interface';
import { CardQueryDto } from 'src/modules/cards/dto/cardQuery.interface';
import { CardDto } from './dto/card.dto';
import { CardEditions } from 'src/database/entities/card-editions.entity';
import { CardEntity } from 'src/database/entities/card.entity';
import * as fs from 'fs';
import * as path from 'path';
import { RARITIES } from './constants';
import { ScrapeGateway } from '../websocket/scrape.gateway';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(CardEditions)
    private readonly cardEditionsRepository: Repository<CardEditions>,
    private readonly httpService: HttpService,
    private readonly scrapeGateway: ScrapeGateway,
  ) {}

  async upsertCardsFromSet(cardSetName: string) {
    const response: AxiosResponse<CardApiResponse> =
      await this.httpService.axiosRef.get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(
          cardSetName,
        )}`,
      );

    const placeHolders: string[] = [];
    const values: any[] = [];

    response.data.data.map((card: ICard) => {
      const formattedCard = this.formatCardData(card, {
        cardSet: cardSetName,
        id: card.id.toString(),
        cardSetNames: [cardSetName],
      });

      values.push(
        formattedCard.name,
        formattedCard.cardSetNames,
        formattedCard.type,
        formattedCard.desc,
        formattedCard.race,
        formattedCard.cardId,
        formattedCard.imageUrl,
        formattedCard.typeline,
        formattedCard.atk,
        formattedCard.def,
        formattedCard.level,
        formattedCard.attribute,
        formattedCard.linkval,
        formattedCard.linkmarkers,
        formattedCard.pend_desc,
        formattedCard.monster_desc,
        formattedCard.scale,
        formattedCard.humanReadableCardType,
        formattedCard.frameType,
        formattedCard.archetype,
      );

      placeHolders.push(
        `($${values.length - 19}, $${values.length - 18}, $${values.length - 17}, $${values.length - 16}, $${values.length - 15}, $${values.length - 14}, $${values.length - 13}, $${values.length - 12}, $${values.length - 11}, $${values.length - 10}, $${values.length - 9}, $${values.length - 8}, $${values.length - 7}, $${values.length - 6}, $${values.length - 5}, $${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`,
      );
    });

    values.push(cardSetName);

    await this.cardRepository.query(
      `
        INSERT INTO "cards" ("name", "cardSetNames", "type", "desc", "race", "cardId", "imageUrl", "typeline", "atk", "def", "level", "attribute", "linkval", "linkmarkers", "pend_desc", "monster_desc", "scale", "humanReadableCardType", "frameType", "archetype")
        VALUES ${placeHolders.join(', ')}
        ON CONFLICT ("name") DO UPDATE
          SET "cardSetNames" = array_append("cards"."cardSetNames", $${values.length})
      `,
      values,
    );
  }

  async getByCardSetCode(cardNumber: string): Promise<CardEditions[]> {
    let cardMetadata: CardEditions;
    try {
      cardMetadata = await this.cardEditionsRepository.findOneOrFail({
        where: { cardNumber },
        relations: ['cards'],
      });
    } catch (error) {
      throw new HttpException(
        `Card with number "${cardNumber}" not found`,
        404,
      );
    }

    const { id, cardSetName } = cardMetadata;
    const setCards = await this.cardEditionsRepository.find({
      where: { cardSetName, id: Not(id) },
      relations: ['cards'],
    });

    return [cardMetadata, ...setCards];
  }

  formatCardData(card: ICard, cardQuery: CardQueryDto): CardDto {
    const {
      id,
      name,
      type,
      desc,
      race,
      imageUrl,
      typeline,
      atk,
      def,
      level,
      attribute,
      linkval,
      linkmarkers,
      pend_desc,
      monster_desc,
      scale,
      humanReadableCardType,
      frameType,
      archetype,
      ...rest
    } = card;

    const parsedCard = {
      name,
      type,
      desc,
      race,
      imageUrl:
        imageUrl ||
        (rest['card_images'] as { image_url?: string }[] | undefined)?.[0]
          ?.image_url,
      typeline,
      atk,
      def,
      level,
      attribute,
      linkval,
      linkmarkers,
      pend_desc,
      monster_desc,
      scale,
      humanReadableCardType,
      frameType,
      archetype,
      cardId: cardQuery.id,
      cardSet: cardQuery.cardSet,
      cardSetNames: cardQuery.cardSetNames || [],
    };

    return parsedCard as CardDto;
  }

  async saveCards(
    collectionName: string,
    cards: ScrapeCardDto[],
    cardSetCode?: string,
    socketId?: string,
  ) {
    const missingCards: ScrapeCardDto[] = [];

    try {
      await this.upsertCardsFromSet(collectionName);
      const names = cards.map((card) => card.Name);
      const cardsFromDb = await this.cardRepository.find({
        where: { name: In(names) },
        order: { name: 'ASC' },
      });

      const cardsMap: Record<string, number> = {};
      cardsFromDb.forEach((card) => {
        cardsMap[card.name] = card.id;
      });

      const cardEditions: CardEditions[] = [];
      cards.forEach((cardEdition) => {
        let rarity = cardEdition['Rarity'] || '';

        const rarities: string[] = [];
        const sortedRarities = RARITIES.sort((a, b) => b.length - a.length);
        for (const _rarity of sortedRarities) {
          if ((rarity || '').includes(_rarity)) {
            rarities.push(_rarity);
            rarity = rarity.replace(_rarity, '').trim();
          }
        }

        const obj = {
          cardNumber: cardEdition['Card Number'] || cardEdition['Set number'],
          cardSetName: cardEdition['Collection Name'],
          name: cardEdition['Name'],
          cardId: cardsMap[cardEdition['Name']],
          rarities,
        } as CardEditions;

        if (
          !obj.cardNumber ||
          !obj.cardSetName ||
          !obj.name ||
          !obj.rarities?.length ||
          !obj.cardId
        ) {
          missingCards.push(cardEdition);
          return;
        }

        cardEditions.push(this.cardEditionsRepository.create(obj));
      });

      await this.cardEditionsRepository
        .createQueryBuilder()
        .insert()
        .into(CardEditions)
        .values(cardEditions)
        .orIgnore()
        .execute();
    } catch (e: any) {
      if (
        !e?.response?.data?.error &&
        typeof !e?.response?.data?.error === 'string' &&
        !e?.response?.data?.error?.includes('No card matching your query')
      ) {
        const collectionNameWithNoSpecialChars = collectionName.replace(
          /[^\w\s]/gi,
          '',
        );
        const seedFilePath = path.join(
          __dirname,
          `../../../../src/logs/${collectionNameWithNoSpecialChars}.json`,
        );

        fs.writeFileSync(
          seedFilePath,
          JSON.stringify({
            collectionName,
            error: JSON.stringify(e, null, 2),
            cards: cards.map((card) => ({
              name: card.Name,
              cardNumber: card['Card Number'],
            })),
          }),
        );
      }
    }

    if (missingCards.length) {
      const seedFilePath = path.join(
        __dirname,
        `../../../../src/logs/missingCards.json`,
      );

      let existingData: ScrapeCardDto[] = [];
      if (fs.existsSync(seedFilePath)) {
        const fileContent = fs.readFileSync(seedFilePath, 'utf-8');
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          existingData = JSON.parse(fileContent);
        } catch {
          existingData = [];
        }
      }

      const updatedData = [...existingData, ...missingCards];
      fs.writeFileSync(seedFilePath, JSON.stringify(updatedData, null, 2));
    }

    // notify clients that searching finished for this collection
    try {
      const payload = { collectionName, count: cards.length, cardSetCode };
      this.scrapeGateway?.notifySearchFinished(payload, socketId);
    } catch (e) {
      // ignore errors emitting websocket notifications
    }
  }
}
