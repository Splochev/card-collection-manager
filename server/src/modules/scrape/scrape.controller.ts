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
import { Public } from 'src/decorators/public.decorator';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new scrape job for cards' })
  @ApiResponse({ status: 201, description: 'Scrape job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post('/')
  migrateCardSets(
    @Body() dto: string[],
    @Headers('x-socket-id') socketId?: string,
  ): Promise<{ message: string; status: number }> {
    void this.scrapeService.scrapeCards(dto, socketId);
    return Promise.resolve({
      message: 'Scrape job started successfully',
      status: 201,
    });
  }
}
