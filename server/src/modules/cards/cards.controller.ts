import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Public } from 'src/decorators/public.decorator';
import { CardEditions } from 'src/database/entities/card-editions.entity';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @ApiOperation({ summary: 'Get cards by card set code' })
  @ApiResponse({
    status: 200,
    description: 'Cards retrieved successfully',
    type: CardEditions,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @Public()
  @Get(':cardSetCode')
  async getCardsByCardSetCode(
    @Param('cardSetCode') cardSetCode: string,
  ): Promise<CardEditions[]> {
    return this.cardsService.getByCardSetCode(cardSetCode);
  }
}
