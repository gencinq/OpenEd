import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = {
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development') {
      // console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  },

  async getClient() {
    const client = await pool.connect();
    return client;
  },

  pool
};
