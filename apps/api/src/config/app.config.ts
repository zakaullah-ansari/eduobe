import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'EduOBE',
  version: process.env.APP_VERSION || '2.0.0',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.HEADER_LANGUAGE || 'x-custom-lang',
}));
