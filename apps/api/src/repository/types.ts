import { InferModel } from 'drizzle-orm';
import { Operation, RecordModel, User } from './schema';

export type UserType = InferModel<typeof User, 'select'>;
export type NewUserType = InferModel<typeof User, 'insert'>;

export type OperationModelType = InferModel<typeof Operation, 'select'>;
export type NewOperationType = InferModel<typeof Operation, 'insert'>;

export type RecordType = InferModel<typeof RecordModel, 'select'>;
export type RecordOperationType = Omit<RecordType, 'isDeleted'> &
  Pick<OperationModelType, 'type'>;
export type NewRecordType = InferModel<typeof RecordModel, 'insert'>;
