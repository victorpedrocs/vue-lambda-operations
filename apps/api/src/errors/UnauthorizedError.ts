import { ApiError } from './ApiError';

export class UnauthorizedError extends ApiError {
  constructor(msg = 'User is not authorized') {
    super(msg, 401);
  }
}
