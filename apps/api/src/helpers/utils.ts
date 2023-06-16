import { createHash } from 'node:crypto';
import { sign } from 'jsonwebtoken';
import { getAppConfig } from '../config/appConfig';
import { UserType } from '../repository/types';
import { NextFunction, Request, Response } from 'express';

export async function getHash(text: string): Promise<string> {
  const hash = createHash('sha256');

  const result = new Promise<string>((resolve, reject) => {
    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        return resolve(data.toString('hex'));
      }
      reject('no data from hash');
    });
  });

  hash.write(text);
  hash.end();

  return result;
}

export function mapUserResponse(user: UserType): Omit<UserType, 'password'> {
  return {
    id: user.id,
    username: user.username,
    status: user.status,
  };
}

export type AuthTokenPayload = Pick<UserType, 'id' | 'username'>;
export function getUserToken(user: UserType) {
  const { jwtSecret } = getAppConfig();
  const tokenPayload: AuthTokenPayload = {
    username: user.username,
    id: user.id,
  };
  return sign(tokenPayload, jwtSecret);
}
