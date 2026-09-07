import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { EventService, DomainEvent } from '../event/event.service';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';

import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private eventService: EventService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password, tenantId } = dto;

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        ...(tenantId && { tenantId }),
        status: 'active',
      },
      include: {
        tenant: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.passwordHash, password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Extract roles and permissions
    const roles = user.userRoles.map((ur) => ur.role.code);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map(
            (rp) => `${rp.permission.resource}:${rp.permission.action}:${rp.permission.scope}`,
          ),
        ),
      ),
    ];

    // Generate tokens
    const accessToken = await this.generateAccessToken(user, roles, permissions);
    const refreshToken = await this.generateRefreshToken(user.id, user.tenantId);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Emit event
    this.eventService.emit(DomainEvent.USER_LOGIN, {
      userId: user.id,
      tenantId: user.tenantId,
      timestamp: new Date().toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
        roles,
        permissions,
        avatar: user.avatar,
      },
    };
  }

  async register(dto: RegisterDto) {
    const { email, password, firstName, lastName, tenantId, phone } = dto;

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        tenantId,
        status: 'active',
        emailVerified: true, // Auto-verify for now
      },
    });

    // Assign default role (student or based on tenant config)
    const defaultRole = await this.prisma.role.findFirst({
      where: { tenantId, code: 'student' },
    });

    if (defaultRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
          assignedBy: 'system',
        },
      });
    }

    // Send welcome email
    await this.emailService.sendWelcomeEmail(email, firstName, password);

    // Emit event
    this.eventService.emit(DomainEvent.USER_CREATED, {
      userId: user.id,
      tenantId,
      timestamp: new Date().toISOString(),
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      // Find token in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.revokedAt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Revoke old token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      // Get user with roles and permissions
      const user = await this.prisma.user.findUnique({
        where: { id: storedToken.userId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User not found or inactive');
      }

      const roles = user.userRoles.map((ur) => ur.role.code);
      const permissions = [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map(
              (rp) => `${rp.permission.resource}:${rp.permission.action}:${rp.permission.scope}`,
            ),
          ),
        ),
      ];

      // Generate new tokens
      const accessToken = await this.generateAccessToken(user, roles, permissions);
      const newRefreshToken = await this.generateRefreshToken(user.id, user.tenantId);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Revoke specific refresh token
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all refresh tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Emit event
    this.eventService.emit(DomainEvent.USER_LOGOUT, {
      userId,
      timestamp: new Date().toISOString(),
    });

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, tenantId } = dto;

    const user = await this.prisma.user.findFirst({
      where: { email, tenantId, status: 'active' },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in user metadata
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          resetToken,
          resetTokenExpiry: resetTokenExpiry.toISOString(),
        },
      },
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    // Find user with this reset token
    const users = await this.prisma.user.findMany({
      where: {
        metadata: {
          path: ['resetToken'],
          equals: token,
        },
      },
    });

    if (users.length === 0) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = users[0];
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const metadata = user.metadata as any;

    // Check expiry
    if (new Date(metadata.resetTokenExpiry) < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        metadata: {},
      },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isValid = await verifyPassword(user.passwordHash, currentPassword);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all refresh tokens (force re-login)
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = user.userRoles.map((ur) => ({
      id: ur.role.id,
      code: ur.role.code,
      name: ur.role.name,
      scopeType: ur.scopeType,
      scopeId: ur.scopeId,
    }));

    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map(
            (rp) => `${rp.permission.resource}:${rp.permission.action}:${rp.permission.scope}`,
          ),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
      roles,
      permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    this.eventService.emit(DomainEvent.USER_UPDATED, {
      userId,
      changes: dto,
      timestamp: new Date().toISOString(),
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  private async generateAccessToken(user: any, roles: string[], permissions: string[]) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles,
      permissions,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
    });
  }

  private async generateRefreshToken(userId: string, tenantId: string) {
    const payload = {
      sub: userId,
      tenantId,
      type: 'refresh',
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
    });

    // Store in database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        family: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return token;
  }
}
