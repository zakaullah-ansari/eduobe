import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'postgresql://eduobe:eduobe@localhost:5432/eduobe',
  logging: process.env.DATABASE_LOGGING === 'true',
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10', 10),
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
}));
