import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCardDto } from './dto/create-card.dto';
import { SearchCardDto } from './dto/search-card.dto';
import { CardsService } from './cards.service';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({
    status: 201,
    description: 'Card created successfully',
    type: CreateCardDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post()
  async createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(createCardDto);
  }

  @ApiOperation({ summary: 'Get card by code' })
  @ApiParam({
    name: 'cardCode',
    type: String,
    description: 'Unique code of the card',
  })
  @ApiResponse({
    status: 200,
    description: 'Card retrieved successfully',
    type: CreateCardDto,
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @Public()
  @Get(':cardCode')
  async getCardByCode(
    @Param('cardCode') cardCode: string,
  ): Promise<CreateCardDto> {
    return this.cardsService.getCardByCode(cardCode);
  }
}
