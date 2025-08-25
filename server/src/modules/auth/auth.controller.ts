import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LogtoWebHookGuard } from 'src/guards/logto-webhook.guard';
import SignupUserDto from './dto/signup-user.dto';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LogtoWebHookGuard('LOGTO_WEBHOOK_SIGNUP'))
  @Post('/signup')
  async postSignup(@Body() body: SignupUserDto): Promise<void> {
    try {
      const authId = body.data.id;
      await this.authService.signup(authId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
