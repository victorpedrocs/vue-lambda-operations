import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, dbClient } from './src/repository/databaseClient';

async function main() {
  await migrate(db, { migrationsFolder: 'drizzle' });
}

main().then(async () => {
  await dbClient.end();
});
