// Side-effect import: must be imported FIRST, before any module that reads
// process.env at import time (e.g. database/pool.ts creates the Pool eagerly).
import dotenv from 'dotenv';

dotenv.config();

// Fail loudly in production if a real secret was never configured.
// A hardcoded fallback would silently weaken JWT security in prod.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production. Refusing to start with a default secret.');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';
