import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CardDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  cardType!: string;

  @ApiProperty()
  @IsString()
  effect!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  artwork?: string;

  @ApiProperty()
  @IsString()
  cardSetCode!: string;

  @ApiProperty()
  @IsOptional()
  metadata?: any;
}
