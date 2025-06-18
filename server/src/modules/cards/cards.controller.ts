import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { SearchCardDto } from './dto/search-card.dto';
import { CardsService } from './cards.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(createCardDto);
  }

  @Public()
  @Get(':cardCode')
  async getCardByCode(
    @Param('cardCode') cardCode: string,
  ): Promise<CreateCardDto> {
    return this.cardsService.getCardByCode(cardCode);
  }
}
