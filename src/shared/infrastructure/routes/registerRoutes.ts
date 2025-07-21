import { Application, Request, Response } from 'express';
import { MESSAGES } from '@/shared/constants/messages';
import { API_ROUTES } from '@/shared/config/routes';
import userRoutes from '@/modules/user/infrastructure/routes/userRoutes';

export function registerRoutes(app: Application): void {
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: MESSAGES.HEALTH_OK,
      timestamp: new Date().toISOString(),
    });
  });

  // // API routes
  app.use(API_ROUTES.USERS, userRoutes);

  // // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: MESSAGES.ROUTE_NOT_FOUND,
    });
  });
}
