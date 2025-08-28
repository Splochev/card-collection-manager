import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
// import assert from 'assert';
import jwt, { JwtHeader } from 'jsonwebtoken';

// Extend Express Request interface to include userAuthId
declare module 'express-serve-static-core' {
  interface Request {
    userAuthId?: string;
  }
}
import * as jwksRsa from 'jwks-rsa';
import { configDotenv } from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');
configDotenv({ path: envPath });

if (!process.env.LOGTO_JWKS_URI) {
  throw new Error('LOGTO_JWKS_URI environment variable is not set');
}

if (!process.env.LOGTO_ISSUER) {
  throw new Error('LOGTO_ISSUER environment variable is not set');
}

if (!process.env.LOGTO_AUDIENCE) {
  throw new Error('LOGTO_AUDIENCE environment variable is not set');
}

// Helper: Extract Bearer Token
function extractBearerTokenFromHeaders(
  headers: Record<string, any>,
): string | undefined {
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (!authHeader?.startsWith('Bearer ')) return undefined;
  return authHeader.slice('Bearer '.length);
}

// JWKS client setup
const client = new jwksRsa.JwksClient({
  jwksUri: process.env.LOGTO_JWKS_URI || '',
});

// JWKS key resolver function
function getKey(
  header: JwtHeader,
  callback: (err: Error | null, key?: string) => void,
) {
  if (!header.kid) {
    return callback(new Error('Missing kid in token header'));
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);

    // Safely handle key types
    const signingKey =
      key && typeof key === 'object'
        ? typeof key.getPublicKey === 'function'
          ? key.getPublicKey()
          : ''
        : '';

    callback(null, signingKey);
  });
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = extractBearerTokenFromHeaders(req.headers);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    debugger;
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: process.env.LOGTO_ISSUER,
          audience: process.env.LOGTO_AUDIENCE,
          algorithms: ['ES384'] as jwt.Algorithm[],
        },
        (err: jwt.VerifyErrors | null, payload: any) => {
          if (err) {
            console.error('JWT verification error:', err);
            if (
              err.name === 'TokenExpiredError' ||
              err.name === 'JsonWebTokenError' ||
              err.name === 'NotBeforeError'
            ) {
              return reject(
                new UnauthorizedException('Token expired or invalid claims'),
              );
            }
            return reject(
              new ForbiddenException(
                'Token verification failed: ' + err.message,
              ),
            );
          }

          // Type checking the payload
          if (!payload || typeof payload !== 'object') {
            return reject(new UnauthorizedException('Invalid token payload'));
          }
          
          const sub = payload.sub as string | undefined;
          
          if (!sub || typeof sub !== 'string') {
            return reject(
              new UnauthorizedException('Missing or invalid subject claim'),
            );
          }
          
          // if (!scope || typeof scope !== 'string') {
          //   throw new Error('Missing or invalid scope claim');
          // }
          // assert(
          //   scope.split(' ').includes('read:products'),
          //   'Missing required scope "read:products"',
          // );
          // req.userAuthId = { userAuthId: sub /*, scope */ }; // Include scope if needed
          
          req.userAuthId = sub;
          resolve(true);
        },
      );
    });
  }
}
