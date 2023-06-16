import { ErrorRequestHandler } from 'express';
import { getAppConfig } from '../config/appConfig';
import { ApiError } from '../errors/ApiError';

export const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  fn(req, res, next).catch(next);

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { isProd } = getAppConfig();

  req.log.error({ err }, 'Server Error');

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({
    message: isProd ? 'unknown error' : err.message,
  });
};
