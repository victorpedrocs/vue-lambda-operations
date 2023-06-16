import { Response } from 'express';
import { Request } from 'express-jwt';
import { dropRecord } from '../../repository/record';
import { InvalidInputError } from '../../errors/InvalidInputError';
import { AuthTokenPayload } from '../../helpers/utils';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export type DeleteRecordBody = {
  id: number;
};
export async function deleteRecord(
  req: Request<AuthTokenPayload>,
  res: Response,
) {
  const userId = req.auth?.id;
  const recId = req.params.id;
  req.log.info({ userId, recId }, 'DELETE /records handler');

  if (!userId) throw new UnauthorizedError();
  if (!recId) throw new InvalidInputError('Invalid record id');

  try {
    const result = await dropRecord({ recordId: parseInt(recId), userId });

    if (!result) {
      return res.status(400).send(new InvalidInputError('record not found'));
    }

    res.status(200).send();
  } catch (error) {
    req.log.error(error, 'Failed to delete the record');
    throw error;
  }
}
