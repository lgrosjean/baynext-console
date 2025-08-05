import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";

config({ path: process.env.VERCEL_ENV ? '.env' : '.env.local' });

const pool = new Pool({
  connectionString: "postgres://postgres.mnisnviecnndytrlmmrs:XAVea5OwBP8VKK2t@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
});

const db = drizzle({ client: pool });

export { db };