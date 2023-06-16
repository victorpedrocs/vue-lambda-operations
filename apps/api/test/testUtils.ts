import app from '../app';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { NewRecordType, RecordType, UserType } from '../src/repository/types';
import { InitialBalance } from '../src/helpers/const';
import { db } from '../src/repository/databaseClient';
import { RecordModel } from '../src/repository/schema';

export type AuthResponseBody = Omit<UserType, 'password'> & {
  token: string;
};
export async function createUser(): Promise<AuthResponseBody> {
  const response = await request(app).post('/v1/auth/signup').send({
    username: faker.internet.userName(),
    password: 'operations',
  });
  return response.body;
}

export function generateRecords(userId: number, amount = 1): NewRecordType[] {
  return Array.from(Array(amount)).map<NewRecordType>(() => ({
    amount: faker.number.int({ min: 1, max: 10 }),
    userId,
    dateTime: faker.date.recent(),
    isDeleted: false,
    operationId: faker.number.int({ min: 1, max: 6 }),
    userBalance: faker.number.int({ max: InitialBalance }),
    operationResponse: faker.number.int({ max: InitialBalance }).toString(),
  }));
}

export async function createRecord(
  userId: number,
  record?: Partial<NewRecordType>,
): Promise<RecordType> {
  const [newRecord] = await db
    .insert(RecordModel)
    .values({
      ...generateRecords(userId)[0],
      ...record,
    })
    .returning();
  return newRecord;
}

export async function createRecords(
  userId: number,
  amount?: number,
): Promise<RecordType[]> {
  const newRecords = generateRecords(userId, amount);
  const records = await db.insert(RecordModel).values(newRecords).returning();
  return records;
}
