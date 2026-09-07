import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('mail.apiKey');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }

    this.fromEmail = this.configService.get<string>('mail.fromEmail') || 'noreply@eduobe.com';
    this.fromName = this.configService.get<string>('mail.fromName') || 'EduOBE';
  }

  async sendEmail(options: SendEmailOptions): Promise<{ id?: string; error?: string }> {
    if (!this.resend) {
      console.warn('⚠️ Email service not configured (RESEND_API_KEY missing)');
      return { error: 'Email service not configured' };
    }

    try {
      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return { id: (result as any).id ?? (result as any).data?.id };
    } catch (error: any) {
      console.error('❌ Email send error:', error.message);
      return { error: error.message };
    }
  }

  async sendWelcomeEmail(email: string, firstName: string, password: string) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to EduOBE',
      html: `
        <h1>Welcome to EduOBE, ${firstName}!</h1>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p>Please log in and change your password immediately.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
