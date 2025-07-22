import { Request, Response, NextFunction } from 'express';
import {
  JwtService,
  JwtPayload,
} from '@/modules/auth/infrastructure/services/JwtService';
import { MESSAGES } from '@/shared/constants/messages';
import { tokenBlacklist } from '@/shared/infrastructure/security/tokenBlacklist';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: MESSAGES.AUTH_REQUIRED });
    }
    if (tokenBlacklist.has(token)) {
      return res
        .status(401)
        .json({ success: false, message: MESSAGES.INVALID_JWT_TOKEN });
    }
    const jwtService = new JwtService();
    const payload = jwtService.verifyAccessToken(token);
    (req as Request & { user?: JwtPayload }).user = payload;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: MESSAGES.INVALID_JWT_TOKEN });
  }
}
