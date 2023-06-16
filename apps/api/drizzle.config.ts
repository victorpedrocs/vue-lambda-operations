import type { Config } from 'drizzle-kit';

export default {
  schema: './src/repository/schema.ts',
  out: './drizzle',
} satisfies Config;
