import { UserDto } from './user.dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class GetUserDto extends PartialType(
  OmitType(UserDto, ['password'] as const),
) {}
