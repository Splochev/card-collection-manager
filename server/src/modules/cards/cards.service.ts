import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
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
    const requests = cardQueries.map((cardQuery, index) =>
      this.getCardById(cardQuery).catch((error) => {
        if (error instanceof Error) {
          console.error(error);
          failedIds.push({ id: cardQuery.id, error: error.message, index });
        }
      }),
    );

    const cards = await Promise.all(requests);
    return cards as CardDto[];
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
}
