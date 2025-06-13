import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
