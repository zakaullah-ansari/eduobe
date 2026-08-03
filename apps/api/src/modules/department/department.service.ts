import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './dto/department.dto';
import { EventService, DomainEvent } from '../event/event.service';

@Injectable()
export class DepartmentService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
  ) {}

  async create(tenantId: string, dto: CreateDepartmentDto, userId: string) {
    // Check for duplicate code
    const existingCode = await this.prisma.department.findFirst({
      where: { tenantId, code: dto.code },
    });

    if (existingCode) {
      throw new ConflictException(`Department with code "${dto.code}" already exists`);
    }

    // Check for duplicate name
    const existingName = await this.prisma.department.findFirst({
      where: { tenantId, name: dto.name },
    });

    if (existingName) {
      throw new ConflictException(`Department with name "${dto.name}" already exists`);
    }

    const department = await this.prisma.department.create({
      data: {
        ...dto,
        tenantId,
        status: 'active',
      },
      include: {
        hod: true,
      },
    });

    this.eventService.emit(DomainEvent.DEPARTMENT_CREATED, {
      department,
      userId,
      tenantId,
    });

    return department;
  }

  async findAll(tenantId: string, query: DepartmentQueryDto) {
    const where: any = { tenantId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.department.findMany({
      where,
      include: {
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            programs: true,
            faculty: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
      include: {
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        programs: {
          where: { status: 'active' },
          include: {
            _count: {
              select: {
                batches: true,
              },
            },
          },
        },
        faculty: {
          where: { status: 'active' },
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            designation: true,
          },
        },
        _count: {
          select: {
            programs: true,
            faculty: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(tenantId: string, id: string, dto: UpdateDepartmentDto, userId: string) {
    const existing = await this.findOne(tenantId, id);

    // Check for duplicate code if changing
    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.department.findFirst({
        where: { tenantId, code: dto.code, id: { not: id } },
      });

      if (duplicate) {
        throw new ConflictException(`Department with code "${dto.code}" already exists`);
      }
    }

    // Check for duplicate name if changing
    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.prisma.department.findFirst({
        where: { tenantId, name: dto.name, id: { not: id } },
      });

      if (duplicate) {
        throw new ConflictException(`Department with name "${dto.name}" already exists`);
      }
    }

    const department = await this.prisma.department.update({
      where: { id },
      data: dto,
      include: {
        hod: true,
      },
    });

    this.eventService.emit(DomainEvent.DEPARTMENT_UPDATED, {
      department,
      userId,
      tenantId,
    });

    return department;
  }

  async remove(tenantId: string, id: string, userId: string) {
    const existing = await this.findOne(tenantId, id);

    // Check if has programs
    const programCount = await this.prisma.program.count({
      where: { departmentId: id, status: 'active' },
    });

    if (programCount > 0) {
      throw new ConflictException(
        `Cannot delete department with ${programCount} active programs. Archive it instead.`,
      );
    }

    // Check if has faculty
    const facultyCount = await this.prisma.faculty.count({
      where: { departmentId: id, status: 'active' },
    });

    if (facultyCount > 0) {
      throw new ConflictException(
        `Cannot delete department with ${facultyCount} active faculty. Reassign them first.`,
      );
    }

    await this.prisma.department.update({
      where: { id },
      data: { status: 'archived' },
    });

    this.eventService.emit(DomainEvent.DEPARTMENT_ARCHIVED, {
      departmentId: id,
      userId,
      tenantId,
    });

    return { message: 'Department archived successfully' };
  }
}
