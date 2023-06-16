import { cleanEnv, num, str } from 'envalid';

type RandomConfig = {
  maxLength: number;
  randomKey: string;
  randomAddress: string;
};

export function getRandomConfig(): RandomConfig {
  const env = cleanEnv(process.env, {
    RANDOM_KEY: str(),
    RANDOM_ADDRESS: str(),
    RANDOM_STR_MAX_LENGTH: num({ default: 32 }),
  });

  return {
    randomAddress: env.RANDOM_ADDRESS,
    randomKey: env.RANDOM_KEY,
    maxLength: env.RANDOM_STR_MAX_LENGTH,
  };
}
