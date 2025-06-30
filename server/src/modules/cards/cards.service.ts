import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Card } from '../../database/entities/card.entity';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  CardApiResponse,
  ICard,
} from 'src/interfaces/cards/CardApiResponse.interface';
import { CardQueryDto } from 'src/modules/cards/dto/cardQuery.interface';
import { CardDto } from './dto/card.dto';
import { CardSets } from 'src/database/entities/card-sets.entity';
import { randomUUID } from 'crypto';

const CHUNK_SIZE = 20;

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardSets)
    private readonly cardSetRepository: Repository<CardSets>,
    private readonly httpService: HttpService,
  ) {}

  async getCardById(cardQuery: CardQueryDto): Promise<CardDto> {
    try {
      const response: AxiosResponse<CardApiResponse> =
        await this.httpService.axiosRef.get(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardQuery.id}`,
        );

      return this.formatCardData(response.data.data[0], cardQuery);
    } catch (error) {
      console.error(error);
      throw new HttpException(`Card with ID "${cardQuery.id}" not found`, 404);
    }
  }

  async getCardsByIds(
    cardQueries: CardQueryDto[],
  ): Promise<Array<CardDto | null>> {
    const failedIds: { id: string; error: string; index: number }[] = [];
    const results = new Array(cardQueries.length).fill(
      null,
    ) as (CardDto | null)[];

    if (cardQueries.length === 0) {
      return results;
    }

    const isValidCardQuery = (
      query: CardQueryDto,
    ): query is Required<Pick<CardQueryDto, 'id' | 'cardSet'>> &
      CardQueryDto => {
      return !!(query.id && query.cardSet);
    };

    if (!cardQueries.every(isValidCardQuery)) {
      throw new HttpException(
        'All card queries must have an ID and a card set',
        400,
      );
    }

    for (let start = 0; start < cardQueries.length; start += CHUNK_SIZE) {
      const end = Math.min(start + CHUNK_SIZE, cardQueries.length);
      const chunk = cardQueries.slice(start, end);

      const chunkRequests = chunk.map((cardQuery, idx) =>
        this.getCardById(cardQuery)
          .then((card) => {
            results[start + idx] = card;
          })
          .catch((error) => {
            if (error instanceof Error) {
              console.error(error);
              failedIds.push({
                id: cardQuery.id,
                error: error.message,
                index: start + idx,
              });
            } else {
              console.error('Unknown error:', error);
              failedIds.push({
                id: cardQuery.id,
                error: String(error),
                index: start + idx,
              });
            }
          }),
      );

      await Promise.all(chunkRequests);
    }

    if (failedIds.length) {
      console.warn('Some card fetches failed:', failedIds);
    }

    return results;
  }

  async getCardsBySet(cardSetName: string): Promise<CardDto[]> {
    try {
      const response: AxiosResponse<CardApiResponse> =
        await this.httpService.axiosRef.get(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(
            cardSetName,
          )}`,
        );

      return response.data.data.map((card) =>
        this.formatCardData(card, {
          cardSet: cardSetName,
          id: card.id.toString(),
        }),
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(`Cards from set "${cardSetName}" not found`, 404);
    }
  }

  formatCardData(card: ICard, cardQuery: CardQueryDto): CardDto {
    const {
      id,
      humanReadableCardType,
      archetype,
      frameType,
      ygoprodeck_url,
      card_sets,
      card_prices,
      card_images,
      banlist_info,
      ...cardData
    } = card;

    cardData.cardSet = cardQuery.cardSet;
    cardData.cardId = id.toString();
    cardData.imageUrl = card_images?.[0]?.image_url || null;
    return cardData as CardDto;
  }

  async getCardByCode(
    cardCode: string,
    cardName: string,
  ): Promise<CardDto | undefined> {
    const [cardSetQuery, cardId] = cardCode.split('-');
    if (!cardSetQuery || !cardId) {
      throw new HttpException('Invalid card code format', 400);
    }

    const cardSet: CardSets[] = await this.cardSetRepository.query(
      'SELECT * FROM "cardSets" WHERE abbreviations @> $1 LIMIT 1',
      [JSON.stringify([cardSetQuery])],
    );

    if (!cardSet.length || cardSet[0].isMissing) {
      if (!cardSet.length) {
        await this.cardSetRepository.insert({
          name: randomUUID(),
          abbreviations: [cardSetQuery],
          isMissing: true,
        });
      }
      throw new HttpException(
        `Card set "${cardSetQuery}" not found. Try searching with card id instead.`,
        404,
      );
    }

    const cards = await this.getCardsBySet(cardSet[0]?.name);
    const cardNameLower = cardName.toLowerCase();

    const foundCard = cards.find(
      (card) => card.name?.toLowerCase() === cardNameLower,
    );

    return foundCard;
  }
}
