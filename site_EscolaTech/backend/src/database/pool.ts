import { Pool, PoolConfig } from 'pg';

// In production, refuse to silently fall back to local-dev defaults — a
// misconfigured DB_HOST/DB_PASSWORD should fail loudly, not connect to the
// wrong database (or worse, fail to connect while looking "fine").
if (process.env.NODE_ENV === 'production') {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }
}

const poolConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'go2cloud',
  // RDS requires SSL by default; local Docker postgres does not support it.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 20,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function getConnection() {
  return pool.connect();
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Query executed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
