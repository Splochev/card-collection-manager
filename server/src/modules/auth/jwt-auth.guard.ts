import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/interfaces/auth/jwtPayload.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtPayload | null>(
    err: Error | null,
    user: TUser,
    info: string | undefined,
    context: ExecutionContext,
    status?: string | number,
  ): TUser {
    if (err || !user) {
      console.error('JwtAuthGuard error:', {
        err,
        info,
        context,
        status,
      });
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
