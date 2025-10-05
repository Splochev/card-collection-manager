import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CardEditions } from 'src/database/entities/card-editions.entity';
import { JwtAuthGuard } from 'src/guards/logto-jwt.guard';
import { IRequest } from 'src/interfaces/general/requst.interface';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from '../users/users.service';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly usersService: UsersService,
  ) {}
  @ApiOperation({ summary: 'Get cards by card set code' })
  @ApiResponse({
    status: 200,
    description: 'Cards retrieved successfully',
    type: CardEditions,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':cardSetCode')
  async getCardsByCardSetCode(
    @Param('cardSetCode') cardSetCode: string,
    @Req() req: IRequest,
  ): Promise<CardEditions[]> {
    const user: User = await this.usersService.getUser(req);
    return this.cardsService.getByCardSetCode(cardSetCode, user.id);
  }

  @ApiOperation({ summary: 'Add card to collection and its quantity' })
  @ApiResponse({
    status: 200,
    description: 'Card added to collection successfully',
    type: CardEditions,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addCardToCollection(
    @Req() req: IRequest,
    @Body('cardSetCode') cardSetCode: string,
    @Body('quantity') quantity: number,
  ): Promise<{ status: string; message: string }> {
    const user: User = await this.usersService.getUser(req);
    await this.cardsService.addCardToCollection(cardSetCode, quantity, user.id);
    return {
      status: 'success',
      message: 'Card added to collection successfully',
    };
  }
}
