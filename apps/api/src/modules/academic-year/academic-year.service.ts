import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicYearDto, UpdateAcademicYearDto, AcademicYearQueryDto } from './dto/academic-year.dto';
import { EventService, DomainEvent } from '../event/event.service';

@Injectable()
export class AcademicYearService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
  ) {}

  async create(tenantId: string, dto: CreateAcademicYearDto, userId: string) {
    // Check for duplicate name
    const existing = await this.prisma.academicYear.findFirst({
      where: { tenantId, name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Academic year "${dto.name}" already exists`);
    }

    // If setting as current, unset other current years
    if (dto.isCurrent) {
      await this.prisma.academicYear.updateMany({
        where: { tenantId, isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const academicYear = await this.prisma.academicYear.create({
      data: {
        ...dto,
        tenantId,
        isCurrent: dto.isCurrent || false,
        status: 'active',
      },
    });

    this.eventService.emit(DomainEvent.ACADEMIC_YEAR_CREATED, {
      academicYear,
      userId,
      tenantId,
    });

    return academicYear;
  }

  async findAll(tenantId: string, query: AcademicYearQueryDto) {
    const where: any = { tenantId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.isCurrent !== undefined) {
      where.isCurrent = query.isCurrent;
    }

    return this.prisma.academicYear.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const academicYear = await this.prisma.academicYear.findFirst({
      where: { id, tenantId },
      include: {
        batches: {
          include: {
            program: true,
          },
        },
      },
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    return academicYear;
  }

  async update(tenantId: string, id: string, dto: UpdateAcademicYearDto, userId: string) {
    const existing = await this.findOne(tenantId, id);

    // Check for duplicate name if changing
    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.prisma.academicYear.findFirst({
        where: { tenantId, name: dto.name, id: { not: id } },
      });

      if (duplicate) {
        throw new ConflictException(`Academic year "${dto.name}" already exists`);
      }
    }

    // If setting as current, unset other current years
    if (dto.isCurrent) {
      await this.prisma.academicYear.updateMany({
        where: { tenantId, isCurrent: true, id: { not: id } },
        data: { isCurrent: false },
      });
    }

    const academicYear = await this.prisma.academicYear.update({
      where: { id },
      data: dto,
    });

    this.eventService.emit(DomainEvent.ACADEMIC_YEAR_UPDATED, {
      academicYear,
      userId,
      tenantId,
    });

    return academicYear;
  }

  async remove(tenantId: string, id: string, userId: string) {
    const existing = await this.findOne(tenantId, id);

    // Check if has batches
    const batchCount = await this.prisma.batch.count({
      where: { academicYearId: id },
    });

    if (batchCount > 0) {
      throw new ConflictException(
        `Cannot delete academic year with ${batchCount} batches. Archive it instead.`,
      );
    }

    await this.prisma.academicYear.update({
      where: { id },
      data: { status: 'archived' },
    });

    this.eventService.emit(DomainEvent.ACADEMIC_YEAR_ARCHIVED, {
      academicYearId: id,
      userId,
      tenantId,
    });

    return { message: 'Academic year archived successfully' };
  }

  async setCurrent(tenantId: string, id: string, userId: string) {
    const existing = await this.findOne(tenantId, id);

    // Unset all current years
    await this.prisma.academicYear.updateMany({
      where: { tenantId, isCurrent: true },
      data: { isCurrent: false },
    });

    // Set this year as current
    const academicYear = await this.prisma.academicYear.update({
      where: { id },
      data: { isCurrent: true },
    });

    this.eventService.emit(DomainEvent.ACADEMIC_YEAR_UPDATED, {
      academicYear,
      userId,
      tenantId,
    });

    return academicYear;
  }
}
