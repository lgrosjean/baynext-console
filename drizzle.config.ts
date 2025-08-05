import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: process.env.VERCEL_ENV ? '.env' : '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://postgres.mnisnviecnndytrlmmrs:XAVea5OwBP8VKK2t@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
  },
});
