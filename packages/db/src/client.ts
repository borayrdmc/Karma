import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from './schemas';

const client = postgres(process.env.DATABASE_URL!, {
    max: Number(process.env.DB_MAX_CONNECTIONS) || 10,
    idle_timeout: 20,
    connect_timeout: 10,
});
export const db = drizzle(client, { schema });