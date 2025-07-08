import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  CardApiResponse,
  ICard,
  CardEntityInput,
} from 'src/interfaces/cards/CardApiResponse.interface';
import { CardQueryDto } from 'src/modules/cards/dto/cardQuery.interface';
import { CardDto } from './dto/card.dto';
import { CardEditions } from 'src/database/entities/card-editions.entity';
import { CardEntity } from 'src/database/entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(CardEditions)
    private readonly cardEditionsRepository: Repository<CardEditions>,
    private readonly httpService: HttpService,
  ) {}

  async saveCards(cards: CardDto[]): Promise<void> {
    try {
      const cardEntities: CardEntity[] = (cards as CardEntityInput[]).map(
        (card: CardEntityInput): CardEntity => this.cardRepository.create(card),
      );

      await this.cardRepository.save(cardEntities);
    } catch (error) {
      console.error('Error saving cards:', error);
    }
  }

  async getCardsBySet(cardSetName: string): Promise<CardDto[]> {
    try {
      const cardsFromDb: CardEntity[] | AxiosResponse<CardApiResponse> =
        await this.cardRepository.find({
          where: { cardSet: cardSetName },
          order: { name: 'ASC' },
        });

      let cards: CardDto[] = cardsFromDb as CardDto[];

      if (!cardsFromDb.length) {
        const response: AxiosResponse<CardApiResponse> =
          await this.httpService.axiosRef.get(
            `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(
              cardSetName,
            )}`,
          );

        cards = response.data.data.map((card: ICard) =>
          this.formatCardData(card, {
            cardSet: cardSetName,
            id: card.id.toString(),
          }),
        );

        void this.saveCards(cards);
      }

      return cards;
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
    };

    return parsedCard as CardDto;
  }
}
