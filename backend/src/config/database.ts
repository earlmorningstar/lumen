import { Pool, QueryResult } from 'pg';
import { env } from './env';

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export async function query<T extends Record<string, any>>(text: string, params?: any[]): Promise<T[]> {
    const result: QueryResult<T> = await pool.query(text, params);
    return result.rows;
}

export async function getClient() {
    const client = await pool.connect();
    return client;
}

export async function testConnection() {
    try {
        await pool.query('SELECT NOW()');
        console.log('PostgreSQL connected');
        return true;
    } catch (err) {
        console.error('PostgreSQL connection failed:', err);
        return false;
    }
}