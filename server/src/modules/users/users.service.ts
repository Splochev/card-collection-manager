import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { IRequest } from 'src/interfaces/general/requst.interface';
import { UserCards } from 'src/database/entities/users-cards.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCards)
    private readonly userCards: Repository<UserCards>,
  ) {}

  async deleteByAuthId(authId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { authId } });
    if (user) {
      await this.userCards.delete({ userId: user.id });
      await this.userRepository.remove(user);
    } else {
      throw new HttpException('User not found', 404);
    }
  }

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
