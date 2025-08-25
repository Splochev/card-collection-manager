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
import jwksClient, { SigningKey } from 'jwks-rsa';
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
import { IncomingHttpHeaders } from 'http';

function extractBearerTokenFromHeaders(
  headers: IncomingHttpHeaders,
): string | undefined {
  const getHeaderValue = (key: string): string | undefined => {
    const value = headers[key];
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value[0];
    return undefined;
  };

  const authHeader =
    getHeaderValue('authorization') ?? getHeaderValue('Authorization');

  if (!authHeader?.startsWith('Bearer ')) return undefined;
  return authHeader.slice('Bearer '.length);
}

// JWKS client setup
const client = jwksClient({ jwksUri: process.env.LOGTO_JWKS_URI });

// JWKS key resolver function
function getKey(
  header: JwtHeader,
  callback: (err: Error | null, key?: string) => void,
) {
  if (!header.kid) {
    return callback(new Error('Missing kid in token header'));
  }
  client
    .getSigningKey(header.kid)
    .then((key) => {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    })
    .catch((err) =>
      callback(err instanceof Error ? err : new Error(String(err))),
    );
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = extractBearerTokenFromHeaders(req.headers);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: process.env.LOGTO_ISSUER,
          audience: process.env.LOGTO_AUDIENCE,
          algorithms: ['ES384'],
        },
        (err, payload) => {
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

          const { /*scope,*/ sub } = payload as { sub: string };
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
