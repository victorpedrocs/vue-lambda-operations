import { and, eq } from 'drizzle-orm';
import { NewUserType, UserType } from './types';
import { db } from './databaseClient';
import { User } from './schema';

export async function getUserById(id: number): Promise<UserType> {
  const users = await db.select().from(User).where(eq(User.id, id));

  if (users.length > 1) {
    throw new Error('Invalid data: found more than one user');
  }

  return users[0];
}

export async function getUser(
  username: string,
  password?: string,
): Promise<UserType> {
  const filters = [eq(User.username, username)];

  if (password) {
    filters.push(eq(User.password, password));
  }

  const query = db
    .select()
    .from(User)
    .where(and(...filters));

  const users = await query;

  if (users.length > 1) {
    throw new Error('Invalid data: found more than one user');
  }

  return users[0];
}

export async function createUser(user: NewUserType): Promise<UserType> {
  const [result] = await db.insert(User).values(user).returning();
  return result;
}
