import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDatabaseError } from 'src/utils/error-handler';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    const thisRepository = this.userRepository;
    return thisRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      dto.password = (await hash(dto.password, 10)) as string;
      const user = this.userRepository.create(dto);
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      handleDatabaseError(err);
      throw err;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return null;

      if (dto.password) dto.password = (await hash(dto.password, 10)) as string;
      const updatedUser = { ...user, ...dto };
      await this.userRepository.save(updatedUser);
      return updatedUser;
    } catch (err) {
      handleDatabaseError(err);
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
