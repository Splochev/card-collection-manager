import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from '../../database/entities/card.entity';
import { CardSets } from '../../database/entities/card-sets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardSets]), HttpModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
