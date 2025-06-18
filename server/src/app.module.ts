import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
