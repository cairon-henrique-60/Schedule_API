import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PROJECT_PORT: z.string(),
  DATABASE_ROOT_PASSWORD: z.string(),
  DATABASE_DATABASE_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  SUPA_BASE_URL: z.string(),
  SUPA_BASE_KEY: z.string(),
  SUPA_BASE_EXPIRING_URL: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;

export const ENV_VARIABLES = envSchema.parse(process.env);
