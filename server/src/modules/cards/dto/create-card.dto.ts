import { CardDto } from './card.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateCardDto extends OmitType(CardDto, ['id'] as const) {}
