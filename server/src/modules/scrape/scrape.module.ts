import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { ScrapeService } from './scrape.service';
import { ScrapeController } from './scrape.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ScrapeController],
  providers: [ScrapeService],
  exports: [ScrapeService],
})
export class ScrapeModule {}
