import { describe, test, expect, beforeAll } from 'vitest';
import app from '../app';
import request from 'supertest';
import {
  AuthResponseBody,
  createRecord,
  createRecords,
  createUser,
} from './testUtils';

describe('Get Operations', () => {
  let user: AuthResponseBody;

  beforeAll(async () => {
    user = await createUser();
  });

  test('records with params', async () => {
    await createRecords(user.id, 5);
    const response = await request(app)
      .get('/v1/record')
      .query({
        limit: 5,
        orderBy: 'dateTime',
        sortingOrder: 'desc',
      })
      .set('Authorization', `Bearer ${user.token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.records).toHaveLength(5);
    expect(response.body.count).toBeGreaterThanOrEqual(5);
  });

  test('records query', async () => {
    await createRecord(user.id, {
      operationResponse: 'abcde',
    });
    const response = await request(app)
      .get('/v1/record')
      .query({
        text: 'abcde',
      })
      .set('Authorization', `Bearer ${user.token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.records.length).toBeGreaterThanOrEqual(1);
    expect(response.body.count).toBeGreaterThan(0);
  });
});
