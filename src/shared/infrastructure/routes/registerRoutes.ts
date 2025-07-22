import { Application, Request, Response } from 'express';
import { MESSAGES } from '@/shared/constants/messages';
import authRoutes from '@/modules/auth/infrastructure/routes/authRoutes';
import { ROUTES } from '@/shared/constants/routes';

export function registerRoutes(app: Application): void {
  // Health check
  app.get(ROUTES.HEALTH, (req: Request, res: Response) => {
    res.status(200).json({
      status: MESSAGES.HEALTH_OK,
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use(ROUTES.AUTH.ROOT, authRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: MESSAGES.ROUTE_NOT_FOUND,
    });
  });
}
