import { createApp } from '@/app';
import { config } from '@/config/env';
import logger from '@/config/logger';

function startServer() {
  const app = createApp();
  const port = config.port || 3000;

  app.listen(port, '0.0.0.0', () => {
    logger.info(`🚀 Server listening on port ${port}`);
  });
}

startServer();
