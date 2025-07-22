import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export const JWT_ISSUER = 'targup-backend';

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  provider?: string;
  iat?: number;
  exp?: number;
}

export class JwtService {
  private readonly secret = config.jwt.secret;
  private readonly expiresIn = config.jwt.accessExpirationMinutes * 60; // seconds

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: JWT_ISSUER,
      subject: payload.sub,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret, { issuer: JWT_ISSUER }) as JwtPayload;
  }
}
