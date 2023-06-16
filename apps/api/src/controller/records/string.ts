import { getRandomConfig } from '../../config/randomConfig';
import { InvalidInputError } from '../../errors/InvalidInputError';
import { log } from '../../helpers/logger';
import { getRandomString, RandomStringParams } from '../../helpers/random';

export async function randomStringHandler(
  params: RandomStringParams,
): Promise<string> {
  const { maxLength } = getRandomConfig();
  if (params.length < 0 && params.length > maxLength) {
    log.info(params, 'Length greater than max allowed');
    throw new InvalidInputError('Invalid length');
  }
  return getRandomString(params);
}
