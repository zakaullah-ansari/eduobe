import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.R2_ENDPOINT || 'https://account.r2.cloudflarestorage.com',
  accessKey: process.env.R2_ACCESS_KEY || '',
  secretKey: process.env.R2_SECRET_KEY || '',
  bucket: process.env.R2_BUCKET || 'eduobe-files-dev',
  region: process.env.R2_REGION || 'auto',
  publicUrl: process.env.R2_PUBLIC_URL || '',
}));
