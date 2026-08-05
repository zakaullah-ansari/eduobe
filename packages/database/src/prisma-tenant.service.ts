import type { PrismaClient } from '@prisma/client';

/**
 * PrismaTenantService - Tenant-scoped database queries
 * Ensures all queries are filtered by tenantId for data isolation
 */
export class PrismaTenantService {
  constructor(
    private prisma: PrismaClient,
    private tenantId: string,
  ) {}

  get client(): PrismaClient {
    return this.prisma;
  }

  get tenant(): string {
    return this.tenantId;
  }

  /**
   * Create a new tenant-scoped service instance
   */
  static create(prisma: PrismaClient, tenantId: string): PrismaTenantService {
    return new PrismaTenantService(prisma, tenantId);
  }

  /**
   * Validate that a record belongs to the current tenant
   */
  validateTenant<T extends { tenantId: string }>(record: T): T {
    if (record.tenantId !== this.tenantId) {
      throw new Error(`Tenant isolation violation: record belongs to ${record.tenantId}, not ${this.tenantId}`);
    }
    return record;
  }

  // Tenant-scoped model accessors
  get user() {
    return {
      findMany: (args?: any) =>
        this.prisma.user.findMany({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      findFirst: (args?: any) =>
        this.prisma.user.findFirst({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      findUnique: (args: any) =>
        this.prisma.user.findFirst({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      create: (args: any) =>
        this.prisma.user.create({
          ...args,
          data: { ...args.data, tenantId: this.tenantId },
        }),
      update: (args: any) =>
        this.prisma.user.update(args),
      delete: (args: any) =>
        this.prisma.user.delete(args),
      count: (args?: any) =>
        this.prisma.user.count({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
    };
  }

  get student() {
    return {
      findMany: (args?: any) =>
        this.prisma.student.findMany({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      findFirst: (args?: any) =>
        this.prisma.student.findFirst({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      create: (args: any) =>
        this.prisma.student.create({
          ...args,
          data: { ...args.data, tenantId: this.tenantId },
        }),
      update: (args: any) => this.prisma.student.update(args),
      delete: (args: any) => this.prisma.student.delete(args),
      count: (args?: any) =>
        this.prisma.student.count({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
    };
  }

  get department() {
    return {
      findMany: (args?: any) =>
        this.prisma.department.findMany({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      findFirst: (args?: any) =>
        this.prisma.department.findFirst({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      create: (args: any) =>
        this.prisma.department.create({
          ...args,
          data: { ...args.data, tenantId: this.tenantId },
        }),
      update: (args: any) => this.prisma.department.update(args),
      delete: (args: any) => this.prisma.department.delete(args),
    };
  }

  get courseOffering() {
    return {
      findMany: (args?: any) =>
        this.prisma.courseOffering.findMany({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      findFirst: (args?: any) =>
        this.prisma.courseOffering.findFirst({
          ...args,
          where: { ...args?.where, tenantId: this.tenantId },
        }),
      create: (args: any) =>
        this.prisma.courseOffering.create({
          ...args,
          data: { ...args.data, tenantId: this.tenantId },
        }),
      update: (args: any) => this.prisma.courseOffering.update(args),
    };
  }

  // Generic tenant-scoped query builder
  withTenant<T extends { tenantId?: string }>(data: T): T & { tenantId: string } {
    return { ...data, tenantId: this.tenantId };
  }

  withTenantWhere<W extends Record<string, any>>(where?: W): W & { tenantId: string } {
    return { ...where, tenantId: this.tenantId } as W & { tenantId: string };
  }
}
