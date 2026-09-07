import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { CreateAiSkillGapDto, UpdateAiSkillGapDto, AiSkillGapQueryDto } from './dto/ai-skill-gap.dto';

@Injectable()
export class AiSkillGapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async create(tenantId: string, dto: CreateAiSkillGapDto, userId: string) {
    const record = await this.prisma.skillGapAnalysis.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'SkillGapAnalysis', record, tenantId, userId });
    return record;
  }

  async findAll(tenantId: string, query: AiSkillGapQueryDto) {
    const where: any = { tenantId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.skillGapAnalysis.findMany({
        where,
        orderBy: { createdAt: 'desc' } as any,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
      this.prisma.skillGapAnalysis.count({ where }),
    ]);

    return {
      items,
      meta: {
        page: query.page || 1,
        limit: query.limit || 20,
        total,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const record = await this.prisma.skillGapAnalysis.findFirst({ where: { id, tenantId } });

    if (!record) {
      throw new NotFoundException('SkillGapAnalysis not found');
    }

    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAiSkillGapDto, userId: string) {
    await this.findOne(tenantId, id);

    const record = await this.prisma.skillGapAnalysis.update({
      where: { id },
      data: dto as any,
    });

    this.events.emit(DomainEvent.AI_RECORD_UPDATED, { entity: 'SkillGapAnalysis', record, tenantId, userId });
    return record;
  }

  async remove(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id);

    try {
      await this.prisma.skillGapAnalysis.update({ where: { id }, data: { status: 'archived' } as any });
    } catch {
      await this.prisma.skillGapAnalysis.delete({ where: { id } });
    }

    this.events.emit(DomainEvent.AI_RECORD_DELETED, { entity: 'SkillGapAnalysis', id, tenantId, userId });
    return { message: 'Deleted successfully' };
  }

  async analyze(tenantId: string, dto: CreateAiSkillGapDto, userId: string) {
    const result = await this.aiGateway.invoke('skillgap', {
      tenantId,
      userId,
      ...dto,
    });

    const record = await this.prisma.skillGapAnalysis.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'SkillGapAnalysis', record, tenantId, userId });
    return { ...result, record };
  }

}
