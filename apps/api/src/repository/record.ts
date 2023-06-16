import { and, asc, desc, eq, like, not, sql } from 'drizzle-orm';
import { db } from './databaseClient';
import { Operation, RecordModel } from './schema';
import { InitialBalance } from '../helpers/const';
import { NewRecordType, RecordOperationType, RecordType } from './types';
import { QueryRecordsParams } from '../controller/records/getRecords';
import { log } from '../helpers/logger';

export async function getUserBalance(id: number): Promise<number> {
  const [record] = await db
    .select({
      balance: RecordModel.userBalance,
    })
    .from(RecordModel)
    .where(eq(RecordModel.userId, id))
    .orderBy(desc(RecordModel.dateTime))
    .limit(1);

  return record?.balance ?? InitialBalance;
}

export async function createRecord(record: NewRecordType): Promise<RecordType> {
  const [result] = await db.insert(RecordModel).values(record).returning();
  return result;
}

export async function dropRecord({
  userId,
  recordId,
}: {
  recordId: number;
  userId: number;
}): Promise<RecordType> {
  log.info({ userId, recordId }, 'RecordRepo dropRecord');

  const [result] = await db
    .update(RecordModel)
    .set({ isDeleted: true })
    .where(and(eq(RecordModel.userId, userId), eq(RecordModel.id, recordId)))
    .returning();

  return result;
}

const sortingOrder = {
  asc: asc,
  desc: desc,
};
export async function queryRecords(
  userId: number,
  params: QueryRecordsParams,
): Promise<{ count: number; records: RecordOperationType[] }> {
  log.info({ userId, params }, 'RcordRepo queryRecords');

  const filters = [
    eq(RecordModel.userId, userId),
    not(eq(RecordModel.isDeleted, true)),
  ];
  const query = db
    .select({
      id: RecordModel.id,
      operationId: RecordModel.operationId,
      userId: RecordModel.userId,
      amount: RecordModel.amount,
      userBalance: RecordModel.userBalance,
      operationResponse: RecordModel.operationResponse,
      dateTime: RecordModel.dateTime,
      type: Operation.type,
    })
    .from(RecordModel)
    .innerJoin(Operation, eq(RecordModel.operationId, Operation.id));

  if (params.limit) {
    query.limit(params.limit);
  }
  if (params.offset) {
    query.offset(params.offset);
  }
  if (params.orderBy) {
    query.orderBy(
      sortingOrder[params.sortingOrder || 'asc'](
        RecordModel[params.orderBy] ?? Operation[params.orderBy],
      ),
    );
  }
  if (params.text) {
    filters.push(like(RecordModel.operationResponse, `%${params.text}%`));
  }

  const records = await query.where(and(...filters));
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(RecordModel)
    .innerJoin(Operation, eq(RecordModel.operationId, Operation.id))
    .where(and(...filters));

  log.debug({ count }, 'records found');

  // The query is returning the count in string format
  return { count: Number(count.count), records };
}
