import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Public } from 'src/decorators/public.decorator';
import { CardQueryDto } from './dto/cardQuery.interface';
import { CardDto } from './dto/card.dto';
@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Get multiple cards by their queries' })
  @ApiResponse({
    status: 200,
    description: 'Cards retrieved successfully',
    type: CardDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'One or more cards not found' })
  @Public()
  @Post('multiple')
  async getCardsByQueries(
    @Body() cardQueries: CardQueryDto[],
  ): Promise<Array<CardDto | null>> {
    return this.cardsService.getCardsByIds(cardQueries);
  }

  @ApiOperation({ summary: 'Get card by query' })
  @ApiResponse({
    status: 200,
    description: 'Card retrieved successfully',
    type: CardDto,
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @Public()
  @Post('single')
  async getCardByQuery(@Body() cardQuery: CardQueryDto): Promise<CardDto> {
    return this.cardsService.getCardById(cardQuery);
  }
}
