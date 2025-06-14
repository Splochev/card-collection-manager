import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser,
    info: string | undefined,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      console.error('JwtAuthGuard error:', { err, info });
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
