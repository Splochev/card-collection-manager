import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardEditions } from 'src/database/entities/card-editions.entity';
import { CardEntity } from 'src/database/entities/card.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEditions, CardEntity]),
    HttpModule,
    WebsocketModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
