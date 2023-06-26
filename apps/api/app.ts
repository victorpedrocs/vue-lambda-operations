import express from 'express';
import pino from 'pino-http';
import helmet from 'helmet';
import { notFoundHandler } from './src/middleware/notFoundHandler';
import { errorHandler } from './src/middleware/errorHandler';
import v1Router from './src/routes/v1';
import { log } from './src/helpers/logger';
import { corsHeaders, optionsHandler } from './src/helpers/utils';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  pino({
    logger: log,
  }),
);
app.use(corsHeaders);
app.options('/*', optionsHandler);

// Routes
app.use('/v1', v1Router);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
