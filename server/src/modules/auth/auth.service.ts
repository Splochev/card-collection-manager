import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { handleDatabaseError } from 'src/utils/error-handler';
import { AuthenticatedUser } from 'src/interfaces/userInterfaces/authenticatedUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthenticatedUser> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        const { password, ...userWithoutPassword } = user;
        if (isPasswordValid) return userWithoutPassword as AuthenticatedUser;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      console.error('Error validating user:', error);
      handleDatabaseError(error);
      throw error;
    }
  }

  login(user: AuthenticatedUser) {
    try {
      const payload: { email: string; sub: number } = {
        email: user.email,
        sub: user.id,
      };

      const accessToken: string = this.jwtService.sign(payload) as string;

      return { access_token: accessToken };
    } catch (error) {
      console.error('Error during login:', error);
      handleDatabaseError(error);
      throw error;
    }
  }
}
