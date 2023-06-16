import { describe, test, expect } from 'vitest';
import app from '../app';
import { faker } from '@faker-js/faker';
import request from 'supertest';

describe('User Routes', () => {
  const username = faker.internet.userName();

  describe('/signup', () => {
    test('happy path', async () => {
      const response = await request(app)
        .post('/v1/auth/signup')
        .send({
          username,
          password: 'test',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const signup: { token: string; id: number; username: string } =
        response.body;
      expect(signup.username).toEqual(username);
    });

    test('return error for existing user', async () => {
      const response = await request(app)
        .post('/v1/auth/signup')
        .send({
          username,
          password: 'test',
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.message).toEqual('User already exists');
    });
  });

  describe('/login', () => {
    test('happy path', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
        .send({
          username,
          password: 'test',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const login: { token: string } = response.body;
      expect(login.token).toBeDefined();
    });
  });
});
