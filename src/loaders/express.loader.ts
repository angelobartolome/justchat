
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger } from 'src/utils/logger';

export default async ({ app }: { app: express.Application }) => {

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors());
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));

  logger.info('Express Initialized');
  
  return app;
}