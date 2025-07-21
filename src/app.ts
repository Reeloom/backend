import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { loggerMiddleware } from '@/config/logger';
import { errorHandler } from '@/shared/infrastructure/middlewares/errorHandler';
import { registerRoutes } from '@/shared/infrastructure/routes/registerRoutes';
import { HEADERS } from '@/shared/constants/headers';

// Swagger/OpenAPI
// NOTE: You must install 'swagger-ui-express' and create 'openapi.json' at the project root.
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '@/openapi.json'; // If using TypeScript, enable --resolveJsonModule

// Prometheus
import promClient from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Jaeger tracing stub
function tracingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Here you would start a span, etc. (stub for now)
  next();
}

export function createApp() {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Jaeger tracing stub
  app.use(tracingMiddleware);

  // Logging
  app.use(loggerMiddleware);

  // Swagger docs (uncomment after installing swagger-ui-express and adding openapi.json)
  // app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Prometheus metrics endpoint
  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  collectDefaultMetrics();
  app.get('/api/v1/metrics', async (req, res) => {
    res.set(HEADERS.CONTENT_TYPE, promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  // Registro de rotas
  registerRoutes(app);

  // Error handler global
  app.use(errorHandler);

  return app;
}
