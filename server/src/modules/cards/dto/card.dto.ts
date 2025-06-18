import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CardDto {
  @ApiProperty({ description: 'Unique identifier for the card' })
  @IsNumber()
  id?: number | string;
  cardSet!: string;
  cardId!: string;
  imageUrl!: string | null;
  [key: string]: unknown;
}
