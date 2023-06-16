import { getRandomConfig } from '../config/randomConfig';
import { log } from './logger';

const CHARS = 'abcedfghijklmnopqrstuvxz1234567890';

export type RandomStringParams = {
  length: number;
};
export type RandomStringRequestParams = {
  apiKey: string;
  characters: string;
  length: number;
  n: number;
  pregeneratedRandomization: string | null;
  replacement: boolean;
};
export type RandomStringBody = {
  jsonrpc: '2.0';
  method: 'generateStrings';
  id: number;
  params: RandomStringRequestParams;
};
export type RandomResponseData = {
  [k: string]: string | number | object;
  result: { random: { data: string[]; completionTime: string } };
};

export async function getRandomString({
  length = 10,
}: RandomStringParams): Promise<string> {
  const { randomKey, randomAddress } = getRandomConfig();

  log.info({ length, randomAddress }, 'Random.org client - getRandomString');

  const body: RandomStringBody = {
    jsonrpc: '2.0',
    method: 'generateStrings',
    id: Date.now(),
    params: {
      apiKey: randomKey,
      characters: CHARS,
      length,
      n: 1,
      pregeneratedRandomization: null,
      replacement: true,
    },
  };

  log.debug({ body }, 'getting random string from api');
  const response = await fetch(randomAddress, {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify(body),
  });
  const data: { result: { random: { data: string[] } } } =
    await response.json();

  log.debug({ data }, 'response from random api');
  return data.result.random.data[0];
}
