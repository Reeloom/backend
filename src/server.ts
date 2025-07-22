import { createApp } from '@/app';
import { config } from '@/config/env';
import { logger } from '@/config/logger';
import { NETWORK } from '@/shared/constants/network';

function startServer() {
  const app = createApp();
  const port = config.port || 3000;

  app.listen(port, NETWORK.BIND_ADDRESS, () => {
    logger.info(`🚀 Server listening on port ${port}`);
  });
}

startServer();
