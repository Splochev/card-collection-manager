import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardEditions } from 'src/database/entities/card-editions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardEditions]), HttpModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
