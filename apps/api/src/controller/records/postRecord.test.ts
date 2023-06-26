import { describe, test, beforeAll, it, vi, afterEach, expect } from 'vitest';
import { postRecord } from './postRecord';
import * as UserRepo from '../../repository/record';
import * as OperationRepo from '../../repository/operation';
import { log } from '../../helpers/logger';
import { NewRecordType } from '../../repository/types';
import { mockResponse } from '../../../test/testUtils';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { InvalidInputError } from '../../errors/InvalidInputError';
import * as RandomString from './string';

describe('PostRecord', () => {
  const mockDate = new Date();

  it('should create arithmetic operation', async () => {
    vi.setSystemTime(mockDate);

    const newRecord: NewRecordType = {
      userBalance: 5,
      amount: 5,
      userId: 1,
      operationId: 1,
      dateTime: mockDate,
      operationResponse: '3',
    };
    vi.spyOn(UserRepo, 'getUserBalance').mockResolvedValue(10);
    vi.spyOn(OperationRepo, 'getOperation').mockResolvedValue({
      id: 1,
      cost: 5,
    } as any);
    vi.spyOn(UserRepo, 'createRecord').mockResolvedValue(newRecord as any);
    const req = {
      log,
      auth: { id: 1 },
      body: {
        type: 'add',
        params: {
          a: 1,
          b: 2,
        },
      },
    };

    await Promise.resolve().then(() =>
      postRecord(req as any, mockResponse as any, null as any),
    );
    expect(UserRepo.getUserBalance).toHaveBeenCalledWith(1);
    expect(OperationRepo.getOperation).toHaveBeenCalledWith('add');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(newRecord);
  });

  it('should create string operation', async () => {
    const randomString = 'asdfasdf';
    vi.setSystemTime(mockDate);

    const newRecord: NewRecordType = {
      userBalance: 5,
      amount: 5,
      userId: 1,
      operationId: 1,
      dateTime: mockDate,
      operationResponse: randomString,
    };
    vi.spyOn(UserRepo, 'getUserBalance').mockResolvedValue(10);
    vi.spyOn(OperationRepo, 'getOperation').mockResolvedValue({
      id: 1,
      cost: 5,
    } as any);
    vi.spyOn(UserRepo, 'createRecord').mockResolvedValue(newRecord as any);
    const req = {
      log,
      auth: { id: 1 },
      body: {
        type: 'str',
        params: {
          length: 10,
        },
      },
    };
    vi.spyOn(RandomString, 'randomStringHandler').mockResolvedValue(
      randomString,
    );

    await Promise.resolve().then(() =>
      postRecord(req as any, mockResponse as any, null as any),
    );
    expect(UserRepo.getUserBalance).toHaveBeenCalledWith(1);
    expect(OperationRepo.getOperation).toHaveBeenCalledWith('str');
  });

  it('it should throw when no user in the request', async () => {
    const req = {
      log,
      auth: undefined,
    };

    const result = Promise.resolve().then(() =>
      postRecord(req as any, mockResponse as any, null as any),
    );
    await expect(result).rejects.toThrow(UnauthorizedError);
  });

  it('it should throw when operation is not found', async () => {
    const req = {
      log,
      auth: { id: 1 },
      body: {
        type: 'add',
        params: {
          a: 1,
          b: 2,
        },
      },
    };
    vi.spyOn(OperationRepo, 'getOperation').mockResolvedValue(null);

    const result = Promise.resolve().then(() =>
      postRecord(req as any, mockResponse as any, null as any),
    );
    await expect(result).rejects.toThrow(InvalidInputError);
  });

  it('it should throw when balance is not enough', async () => {
    const req = {
      log,
      auth: { id: 1 },
      body: {
        type: 'add',
        params: {
          a: 1,
          b: 2,
        },
      },
    };
    vi.spyOn(UserRepo, 'getUserBalance').mockResolvedValue(5);
    vi.spyOn(OperationRepo, 'getOperation').mockResolvedValue({
      id: 1,
      cost: 10,
    } as any);

    const result = Promise.resolve().then(() =>
      postRecord(req as any, mockResponse as any, null as any),
    );
    await expect(result).rejects.toThrow(InvalidInputError);
  });
});
