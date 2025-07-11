import { UserDto } from './user.dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['id'] as const),
) {}
