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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsRole } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GetUserDto } from './dto/get-user.dto';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users. Requires admin role.',
  })
  @Get()
  async findAll(): Promise<GetUserDto[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieve a user by their ID. Requires admin role.',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GetUserDto | null> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user. Requires admin role.',
  })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<GetUserDto> {
    return await this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update a user by their ID. Requires admin role.',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<GetUserDto | null> {
    return await this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @IsRole(['admin'])
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Delete a user by their ID. Requires admin role.',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.usersService.remove(id);
  }
}
