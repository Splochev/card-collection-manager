import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/logto-jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @ApiOperation({ summary: 'Create a new scrape job for cards' })
  @ApiResponse({ status: 201, description: 'Scrape job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post('/')
  migrateCardSets(
    @Body() body: { cardSetNames: string[]; cardSetCode: string },
    @Headers('x-socket-id') socketId?: string,
  ): Promise<{ message: string; status: number }> {
    void this.scrapeService.scrapeCards(
      body.cardSetNames,
      body.cardSetCode,
      socketId,
    );
    return Promise.resolve({
      message: 'Scrape job started successfully',
      status: 201,
    });
  }
}
