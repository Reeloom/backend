import winston from 'winston';
import { config } from '@/config/env';

// Configuração do logger
const logger = winston.createLogger({
  level: config.logs.level,
  format:
    config.logs.format === 'json'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
  defaultMeta: { service: 'reeloom-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

// Middleware para Express
export const loggerMiddleware = (req: any, res: any, next: any) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
};

export default logger;
