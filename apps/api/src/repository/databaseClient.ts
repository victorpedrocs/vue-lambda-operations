import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getAppConfig } from '../config/appConfig';

export const dbClient = postgres(getAppConfig().connUrl);

export const db = drizzle(dbClient, { schema, logger: true });
