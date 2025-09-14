import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { ScrapeModule } from './modules/scrape/scrape.module';
import { RedisModule } from './modules/redis/redis.module';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    CacheModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    CardsModule,
    ScrapeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
