import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import { AuthTokenPayload } from '../helpers/utils';

export function authGate(
  req: Request<AuthTokenPayload>,
  res: Response,
  next: NextFunction,
) {
  if (!req.auth) {
    return res.status(401).send('unauthorized');
  }
  next();
}
