import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { GetUserDto } from '../users/dto/get-user.dto';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login, returns JWT token',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR...',
        id: 1,
        email: 'test',
        isVerified: true,
        firstName: 'test',
        lastName: 'test',
        role: 'admin|user',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the currently authenticated user',
    schema: {
      example: {
        id: 1,
        email: 'test',
        isVerified: true,
        firstName: 'test',
        lastName: 'test',
        role: 'admin|user',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  getMe(@Req() req: Request): GetUserDto {
    return req.user as GetUserDto;
  }
}
