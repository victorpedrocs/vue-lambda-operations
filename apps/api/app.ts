import express from 'express';
import pino from 'pino-http';
import helmet from 'helmet';
import { notFoundHandler } from './src/middleware/notFoundHandler';
import { errorHandler } from './src/middleware/errorHandler';
import v1Router from './src/routes/v1';
import { log } from './src/helpers/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  pino({
    logger: log,
  }),
);

// Routes
app.use('/v1', v1Router);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
