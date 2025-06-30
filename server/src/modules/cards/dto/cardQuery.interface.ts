import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsString, IsOptional } from 'class-validator';

export class CardQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cardSet?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
