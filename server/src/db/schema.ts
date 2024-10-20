import "dotenv/config"

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  name: text('name'),
  image: text('image'),
});

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  sessionToken: text('session_token').notNull(),
  expiresAt: text('expires_at').notNull(),
});


const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  
  export const db = drizzle(turso);
