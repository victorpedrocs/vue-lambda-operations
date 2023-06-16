import { RequestHandler } from 'express';
import { Request } from 'express-jwt';
import { randomStringHandler } from './string';
import { RandomStringParams } from '../../helpers/random';
import { AuthTokenPayload } from '../../helpers/utils';
import { createRecord, getUserBalance } from '../../repository/record';
import { NewRecordType } from '../../repository/types';
import { getOperation } from '../../repository/operation';
import { arithmeticHandlers } from '../../helpers/arithmetic';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { InvalidInputError } from '../../errors/InvalidInputError';
import { OperationType } from '../../repository/schema';

type ArithmeticParams = {
  a: number;
  b: number;
};

export type ArithmeticOpBody = {
  type: OperationType;
  params: RandomStringParams | ArithmeticParams;
};

export const postRecord: RequestHandler = async (
  req: Request<AuthTokenPayload>,
  res,
) => {
  const id = req.auth?.id;
  req.log.info({ user: id, body: req.body }, '/operations handler');

  if (!id) {
    throw new UnauthorizedError();
  }

  const userBalance = await getUserBalance(id);
  req.log.info({ userBalance }, 'User balance');

  const { type, params } = req.body as ArithmeticOpBody;

  const operation = await getOperation(type);

  if (!operation) {
    req.log.info({ type }, 'Operation not found');
    throw new InvalidInputError('Invalid Operation type');
  }
  if (operation.cost > userBalance) {
    req.log.info({ cost: operation.cost, userBalance }, 'Not enough balance');
    throw new InvalidInputError('Not enough balance', 409);
  }

  const newRecord: NewRecordType = {
    userBalance: userBalance - operation.cost,
    amount: operation.cost,
    userId: id,
    operationId: operation.id,
    dateTime: new Date(),
    operationResponse: '',
  };

  try {
    if (type === 'str') {
      const str = await randomStringHandler(params as RandomStringParams);
      newRecord.operationResponse = str;
    } else {
      const { a, b } = params as ArithmeticParams;
      const result: number = arithmeticHandlers[type](a, b);
      newRecord.operationResponse = `${result}`;
    }

    const record = await createRecord(newRecord);
    res.status(200).send(record);
  } catch (error) {
    req.log.error(error, 'Operation request failed');
    throw error;
  }
};
