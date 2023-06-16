import { describe, test, expect, beforeAll } from 'vitest';
import app from '../app';
import request from 'supertest';
import { RecordType } from '../src/repository/types';
import { createUser } from './testUtils';

describe('Operations', () => {
  let authToken: string = '';

  beforeAll(async () => {
    const { token } = await createUser();
    authToken = token;
  });

  describe('arithmetics operations', () => {
    test('addition', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'add',
          params: {
            a: 23,
            b: 57,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toEqual('80');
    });
    test('subtraction', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'sub',
          params: {
            a: 57,
            b: 23,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toEqual('34');
    });
    test('multiplication', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'multi',
          params: {
            a: 57,
            b: 23,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toEqual('1311');
    });
    test('division', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'div',
          params: {
            a: 24,
            b: 3,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toEqual('8');
    });
    test('square root', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'sqrt',
          params: {
            a: 9,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toEqual('3');
    });
  });

  describe('random string', () => {
    test('random string', async () => {
      const response = await request(app)
        .post('/v1/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'str',
          params: {
            length: 10,
          },
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const { operationResponse }: RecordType = response.body;
      expect(operationResponse).toMatch(/^[a-z0-9]{10}$/);
    });
  });
});
