import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { ScrapeModule } from './modules/scrape/scrape.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CardsModule, ScrapeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
