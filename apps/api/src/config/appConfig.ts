import { cleanEnv, str } from 'envalid';

type AppConfig = {
  jwtSecret: string;
  connUrl: string;
  isProd: boolean;
};
export function getAppConfig(): AppConfig {
  const env = cleanEnv(process.env, {
    JWT_SECRET: str({ default: 'secret' }),
    PG_CONN_URL: str(),
  });

  return {
    jwtSecret: env.JWT_SECRET,
    connUrl: env.PG_CONN_URL,
    isProd: env.isProd,
  };
}
