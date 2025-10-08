import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardEditions } from 'src/database/entities/card-editions.entity';
import { CardEntity } from 'src/database/entities/card.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/user.entity';
import { UserCards } from 'src/database/entities/users-cards.entity';
import { Wishlist } from 'src/database/entities/wishlist.entity';
import { ScrapeService } from '../scrape/scrape.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardEditions,
      CardEntity,
      User,
      UserCards,
      Wishlist,
    ]),
    HttpModule,
    WebsocketModule,
  ],
  controllers: [CardsController],
  providers: [CardsService, UsersService, ScrapeService],
  exports: [CardsService],
})
export class CardsModule {}
