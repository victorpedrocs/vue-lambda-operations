import { describe, test, beforeAll } from 'vitest';
import app from '../app';
import request from 'supertest';
import { createUser } from './testUtils';

describe('DELETE Record', () => {
  let authToken: string = '';

  beforeAll(async () => {
    const { token } = await createUser();
    authToken = token;
  });

  test('delete record', async () => {
    // create record
    const { body: record } = await request(app)
      .post('/v1/record')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'add',
        params: { a: 23, b: 57 },
      });

    await request(app)
      .delete(`/v1/record/${record.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  test('delete record non-existent error', async () => {
    await request(app)
      .delete('/v1/record/0')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);
  });

  test('delete record from different user error', async () => {
    const token2 = await createUser();
    const { body: record } = await request(app)
      .post('/v1/record')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'add',
        params: { a: 23, b: 57 },
      });
    await request(app)
      .delete('/v1/record/' + record.id)
      .set('Authorization', `Bearer ${token2}`)
      .expect(400);
  });
});
