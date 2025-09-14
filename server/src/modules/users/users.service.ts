import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { IRequest } from 'src/interfaces/general/requst.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(authId: string): Promise<User> {
    const user = this.userRepository.create({ authId });
    return this.userRepository.save(user);
  }

  async getUser(req: IRequest): Promise<User> {
    try {
      const userAuthId = req.userAuthId;
      const user = await this.userRepository.findOneOrFail({
        where: { authId: userAuthId },
      });
      return user;
    } catch (error) {
      throw new HttpException('User not found', 404);
    }
  }
}
