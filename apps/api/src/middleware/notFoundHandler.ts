import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  req.log.info('Not found handler');
  return res.status(400).json({ message: 'not found' });
};
