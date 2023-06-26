import { describe, expect, it } from 'vitest';
import { arithmeticHandlers } from './arithmetic';

describe('Arithmetic methods', () => {
  it('should return the expected value for each operation', () => {
    expect(arithmeticHandlers.add(1, 1)).toEqual(2);
    expect(arithmeticHandlers.sub(1, 1)).toEqual(0);
    expect(arithmeticHandlers.div(4, 2)).toEqual(2);
    expect(arithmeticHandlers.multi(2, 2)).toEqual(4);
    expect(arithmeticHandlers.sqrt(9, 0)).toEqual(3);
  });
});
