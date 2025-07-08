import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  CardApiResponse,
  ICard,
} from 'src/interfaces/cards/CardApiResponse.interface';
import { CardQueryDto } from 'src/modules/cards/dto/cardQuery.interface';
import { CardDto } from './dto/card.dto';
import { CardEditions } from 'src/database/entities/card-editions.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEditions)
    private readonly cardEditionsRepository: Repository<CardEditions>,
    private readonly httpService: HttpService,
  ) {}

  async getCardsBySet(cardSetName: string): Promise<CardDto[]> {
    try {
      const response: AxiosResponse<CardApiResponse> =
        await this.httpService.axiosRef.get(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(
            cardSetName,
          )}`,
        );

      return response.data.data.map((card: ICard) =>
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

  async getByCardSetCode(cardNumber: string): Promise<CardDto[]> {
    let cardMetadata: CardEditions;
    try {
      cardMetadata = await this.cardEditionsRepository.findOneOrFail({
        where: { cardNumber },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `Card with number "${cardNumber}" not found`,
        404,
      );
    }

    const { name, cardSetName } = cardMetadata;
    const cardNameLower = name.toLowerCase();
    const newCardsList: Array<CardDto | null> = [null];

    const cards = await this.getCardsBySet(cardSetName);

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.name?.toLowerCase() === cardNameLower) {
        newCardsList[0] = card;
      } else {
        newCardsList.push(card);
      }
    }

    if (!newCardsList[0]) return [];
    return newCardsList as CardDto[];
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
      cardId: cardQuery.id,
      cardSet: cardQuery.cardSet,
    };

    return parsedCard as CardDto;
  }
}
