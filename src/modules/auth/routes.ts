import { Router } from 'express';
import { MESSAGES } from '@/shared/constants/messages';

const router = Router();

router.get('/status', (_, res) => {
  res.json({ message: MESSAGES.AUTH_MODULE_STATUS });
});

export default router;
