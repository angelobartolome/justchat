import express from 'express'

import config from './config'
import loaders from './loaders'
import { logger } from './utils/logger';

async function startServer() {

  const app = express();

  await loaders({ expressApp: app })

  app.listen(config.port, () => {
    logger.info(`Your server is ready on port ${config.port}!`);
  });
}

startServer();