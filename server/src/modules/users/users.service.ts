import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDatabaseError } from 'src/utils/error-handler';
import { hash } from 'bcrypt';
import { IUser } from 'src/interfaces/user/user.interface';

const COLUMNS_TO_SELECT: (keyof User)[] = [
  'id',
  'email',
  'isVerified',
  'firstName',
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<IUser[]> {
    const thisRepository = this.userRepository;
    return thisRepository.find({ select: COLUMNS_TO_SELECT });
  }

  async findOne(id: number): Promise<IUser | null> {
    return this.userRepository.findOne({
      where: { id },
      select: COLUMNS_TO_SELECT,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOne({
      where: { email },
      select: COLUMNS_TO_SELECT,
    });
  }

  async create(dto: CreateUserDto): Promise<IUser> {
    try {
      dto.password = await hash(dto.password, 10);
      const user = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(user);
      return this.userRepository.findOne({
        where: { id: savedUser.id },
        select: COLUMNS_TO_SELECT,
      }) as Promise<IUser>;
    } catch (err: unknown) {
      handleDatabaseError(err);
      throw err;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return null;

      if (dto.password) dto.password = await hash(dto.password, 10);
      const updatedUser = { ...user, ...dto };
      await this.userRepository.save(updatedUser);
      return this.userRepository.findOne({
        where: { id },
        select: COLUMNS_TO_SELECT,
      }) as Promise<IUser>;
    } catch (err) {
      handleDatabaseError(err);
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
