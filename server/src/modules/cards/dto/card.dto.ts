import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CardDto {
  @ApiProperty({ description: 'Unique identifier for the card' })
  @IsNumber()
  id!: number;

  @ApiProperty({ description: 'Name of the card' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Type of the card' })
  @IsString()
  cardType!: string;

  @ApiProperty({ description: 'Effect of the card' })
  @IsString()
  effect!: string;

  @ApiProperty({ description: 'Artwork URL of the card', required: false })
  @IsString()
  @IsOptional()
  artwork?: string;

  @ApiProperty({ description: 'Code of the card set' })
  @IsString()
  cardSetCode!: string;

  @ApiProperty({
    description: 'Additional metadata for the card',
    required: false,
  })
  @IsOptional()
  metadata?: any;
}
