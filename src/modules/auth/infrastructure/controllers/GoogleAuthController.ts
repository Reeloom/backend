import { Request, Response } from 'express';
import { GoogleSignInUseCase } from '@/modules/auth/application/use-cases/google-signin/GoogleSignInUseCase';
import { GoogleAuthService } from '@/modules/auth/infrastructure/services/GoogleAuthService';
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/PrismaUserRepository';
import { PrismaOAuthAccountRepository } from '@/modules/user/infrastructure/repositories/PrismaOAuthAccountRepository';
import { JwtService } from '@/modules/auth/infrastructure/services/JwtService';
import prisma from '@/database/prismaClient';
import { MESSAGES } from '@/shared/constants/messages';
import { COOKIE_NAMES } from '@/shared/constants/providers';
import { MessageValue } from '@/shared/constants/messages';

const googleSignInUseCase = new GoogleSignInUseCase(
  new GoogleAuthService(),
  new PrismaUserRepository(prisma),
  new PrismaOAuthAccountRepository(),
  new JwtService(),
);

export class GoogleAuthController {
  static redirectToGoogle(req: Request, res: Response) {
    const url = googleSignInUseCase.getAuthUrl();
    res.redirect(url);
  }

  static async handleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res
          .status(400)
          .json({ success: false, message: MESSAGES.INVALID_AUTH_CODE });
      }
      const { user, jwt } = await googleSignInUseCase.execute(code);
      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, or use env/config
      });
      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email?.value ?? null,
          name: user.name,
        },
      });
    } catch (err) {
      let message: MessageValue = MESSAGES.AUTH_ERROR;
      if (err instanceof Error && err.message === MESSAGES.INVALID_AUTH_CODE) {
        message = MESSAGES.INVALID_AUTH_CODE;
      }
      return res.status(500).json({ success: false, message });
    }
  }
}
