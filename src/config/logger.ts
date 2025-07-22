import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'reeloom-backend' },
  transports: [new winston.transports.Console()],
});

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info({
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
  });
  next();
};
