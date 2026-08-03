import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  provider: process.env.MAIL_PROVIDER || 'resend',
  apiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.MAIL_FROM_EMAIL || 'noreply@eduobe.com',
  fromName: process.env.MAIL_FROM_NAME || 'EduOBE',
}));
