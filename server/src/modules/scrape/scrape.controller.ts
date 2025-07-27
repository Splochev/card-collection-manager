import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { SuperAdminPasswordGuard } from '../../guards/super-admin-password.guard';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Public()
  @ApiOperation({ summary: 'Create a new scrape job' })
  @ApiResponse({ status: 201, description: 'Scrape job created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @UseGuards(SuperAdminPasswordGuard)
  @Post('/card-sets')
  create(@Body() dto: string[]): Promise<{ message: string; status: number }> {
    void this.scrapeService.scrapeCardSets(dto);
    return Promise.resolve({
      message: 'Scrape job started successfully',
      status: 201,
    });
  }
}
