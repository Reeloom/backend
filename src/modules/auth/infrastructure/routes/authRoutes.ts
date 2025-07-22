import { Router } from 'express';
import { GoogleAuthController } from '@/modules/auth/infrastructure/controllers/GoogleAuthController';
import { InstagramAuthController } from '@/modules/auth/infrastructure/controllers/InstagramAuthController';
import { ROUTES } from '@/shared/constants/routes';

const router = Router();

router.get(ROUTES.AUTH.GOOGLE.REDIRECT, GoogleAuthController.redirectToGoogle);
router.get(ROUTES.AUTH.GOOGLE.CALLBACK, GoogleAuthController.handleCallback);

router.get(
  ROUTES.AUTH.INSTAGRAM.REDIRECT,
  InstagramAuthController.redirectToInstagram,
);
router.get(
  ROUTES.AUTH.INSTAGRAM.CALLBACK,
  InstagramAuthController.handleCallback,
);

export default router;
