import { InvalidInputError } from '../errors/InvalidInputError';
import { OperationType } from '../repository/schema';

function addition(a: number, b: number): number {
  return a + b;
}
function subtraction(a: number, b: number): number {
  return a - b;
}
function multiplication(a: number, b: number): number {
  return a * b;
}
function division(a: number, b: number): number {
  if (b === 0) throw new InvalidInputError('Division by zero');
  return a / b;
}
function square_root(a: number): number {
  return Math.sqrt(a);
}

export const arithmeticHandlers: {
  [k in Exclude<OperationType, 'str'>]: typeof addition | typeof square_root;
} = {
  add: addition,
  sub: subtraction,
  multi: multiplication,
  div: division,
  sqrt: square_root,
};
