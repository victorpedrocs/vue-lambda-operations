import { ApiError } from './ApiError';

export class InvalidInputError extends ApiError {
  constructor(msg = 'Invalid input', status = 400) {
    super(msg, status);
  }
}
