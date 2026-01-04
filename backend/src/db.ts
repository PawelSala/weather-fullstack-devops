import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        city_id TEXT PRIMARY KEY,
        city_name TEXT NOT NULL,
        country TEXT,
        lat DOUBLE PRECISION,
        lon DOUBLE PRECISION,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Database initialized: favorites table ready.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};
