import { eq } from 'drizzle-orm';
import { db } from './databaseClient';
import { Operation, OperationType } from './schema';
import { OperationModelType } from './types';

export async function getOperation(
  opType: OperationType,
): Promise<OperationModelType | null> {
  const [result] = await db
    .select()
    .from(Operation)
    .where(eq(Operation.type, opType));

  return result;
}
