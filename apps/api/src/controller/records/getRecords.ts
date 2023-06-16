import { RequestHandler } from 'express';
import { Request } from 'express-jwt';
import { AuthTokenPayload } from '../../helpers/utils';
import { queryRecords } from '../../repository/record';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export type QueryRecordsParams = {
  text?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'amount' | 'userBalance' | 'dateTime' | 'type';
  sortingOrder?: 'asc' | 'desc';
};

export const getRecords: RequestHandler = async (
  req: Request<AuthTokenPayload>,
  res,
) => {
  const id = req.auth?.id;
  req.log.info({ user: id }, 'GET /operations handler');

  if (!id) {
    throw new UnauthorizedError();
  }

  const params = req.query as QueryRecordsParams;
  const { count, records } = await queryRecords(id, params);

  return res.status(200).json({
    count,
    records,
  });
};
