import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { handleDatabaseError } from 'src/utils/error-handler';
import { IAuthenticatedUser } from 'src/interfaces/user/authenticatedUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<IAuthenticatedUser> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        const { password, ...userWithoutPassword } = user;
        if (isPasswordValid) return userWithoutPassword as IAuthenticatedUser;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      console.error('Error validating user:', error);
      handleDatabaseError(error);
      throw error;
    }
  }

  login(user: IAuthenticatedUser) {
    try {
      const payload: { email: string; sub: number } = {
        email: user.email,
        sub: user.id,
      };

      const accessToken: string = this.jwtService.sign(payload);

      return { access_token: accessToken };
    } catch (error) {
      console.error('Error during login:', error);
      handleDatabaseError(error);
      throw error;
    }
  }
}
