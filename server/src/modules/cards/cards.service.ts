import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../database/entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly httpService: HttpService,
  ) {}

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async getCardByCode(cardSetCode: string): Promise<CreateCardDto> {
    try {
      const response: AxiosResponse<CardApiResponse> =
        await this.httpService.axiosRef.get(
          `https://yugicrawler.vercel.app/card/${cardSetCode}`,
        );

      const { name, cardType, effect, artwork, ...metadata } = response.data;
      const card = {
        name,
        cardType,
        effect,
        artwork,
        cardSetCode,
        metadata,
      } as CreateCardDto;

      return card;
    } catch (error) {
      throw new HttpException(
        `Card with set code "${cardSetCode}" not found`,
        404,
      );
    }
  }

  async getCardsByCodes(
    cardSetCodes: string[],
  ): Promise<Array<CreateCardDto | undefined>> {
    const failedCodes: { code: string; error: string; index: number }[] = [];
    const requests = cardSetCodes.map((code, index) =>
      this.getCardByCode(code).catch((error) => {
        if (error instanceof Error) {
          console.error(error);
          failedCodes.push({ code, error: error.message, index });
        }
      }),
    );

    const cards = await Promise.all(requests);
    // cards = cards.filter((card): card is CreateCardDto => card !== undefined);
    return cards as CreateCardDto[];
  }
}
