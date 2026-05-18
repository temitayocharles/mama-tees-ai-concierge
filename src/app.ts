import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { healthRouter } from './routes/health.js';
import { createCallLogsRouter } from './routes/callLogs.js';
import { createLogSink } from './services/logSink.js';

export function createApp() {
  const app = express();
  const logSink = createLogSink();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  app.use(healthRouter);
  app.use(createCallLogsRouter(logSink));

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
