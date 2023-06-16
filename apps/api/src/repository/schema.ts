import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

type StatusType = 'active' | 'inactive';
export const User = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
    status: text('status').$type<StatusType>().default('active'),
  },
  (user) => ({
    uniqueUsernameIndex: uniqueIndex('unique_username_idx').on(user.username),
  }),
);

export type OperationType = 'add' | 'sub' | 'multi' | 'div' | 'sqrt' | 'str';
export const Operation = pgTable(
  'operation',
  {
    id: serial('id').primaryKey(),
    type: text('type').$type<OperationType>().notNull(),
    cost: integer('cost').notNull(),
  },
  (operation) => ({
    uniqueOperationType: uniqueIndex('unique_operation_type').on(
      operation.type,
    ),
  }),
);

export const RecordModel = pgTable('record', {
  id: serial('id').primaryKey(),
  operationId: integer('operation_id')
    .references(() => Operation.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => User.id)
    .notNull(),
  amount: integer('amount').notNull(),
  userBalance: integer('user_balance').notNull(),
  operationResponse: text('operation_response').notNull(),
  dateTime: timestamp('date_time').notNull(),
  isDeleted: boolean('is_deleted').default(false),
});
