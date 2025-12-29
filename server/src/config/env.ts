import dotenv from 'dotenv';

dotenv.config();

// Parse CORS_ORIGIN as comma-separated list or single value
const parseCorsOrigin = (origin: string | undefined): string | string[] => {
  if (!origin) return 'http://localhost:5173';
  if (origin === '*') return '*';
  const origins = origin.split(',').map(o => o.trim());
  return origins.length === 1 ? origins[0] : origins;
};

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/cheatsheeter',
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  nodeEnv: process.env.NODE_ENV || 'development',
};
