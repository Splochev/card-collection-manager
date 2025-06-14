import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/interfaces/user/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsRole } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IUser | null> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<IUser | null> {
    return await this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.usersService.remove(id);
  }
}
