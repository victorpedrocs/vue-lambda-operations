import { getAppConfig } from '../../config/appConfig';
import { recordsRouter } from './records';
import { authRouter } from './auth';
import { Router } from 'express';
import { expressjwt } from 'express-jwt';
import { authGate } from '../../middleware/authorizationMiddleware';

const { jwtSecret } = getAppConfig();

const v1Router = Router();
v1Router.use('/auth', authRouter);
v1Router.use(
  '/record',
  expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }),
  authGate,
  recordsRouter,
);

export default v1Router;
