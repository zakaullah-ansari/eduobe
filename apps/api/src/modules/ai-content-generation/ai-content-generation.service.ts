import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { CreateAiContentGenerationDto, UpdateAiContentGenerationDto, AiContentGenerationQueryDto } from './dto/ai-content-generation.dto';

@Injectable()
export class AiContentGenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async create(tenantId: string, dto: CreateAiContentGenerationDto, userId: string) {
    const record = await this.prisma.generatedContent.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'GeneratedContent', record, tenantId, userId });
    return record;
  }

  async findAll(tenantId: string, query: AiContentGenerationQueryDto) {
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
      this.prisma.generatedContent.findMany({
        where,
        orderBy: { createdAt: 'desc' } as any,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
      this.prisma.generatedContent.count({ where }),
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
    const record = await this.prisma.generatedContent.findFirst({ where: { id, tenantId } });

    if (!record) {
      throw new NotFoundException('GeneratedContent not found');
    }

    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAiContentGenerationDto, userId: string) {
    await this.findOne(tenantId, id);

    const record = await this.prisma.generatedContent.update({
      where: { id },
      data: dto as any,
    });

    this.events.emit(DomainEvent.AI_RECORD_UPDATED, { entity: 'GeneratedContent', record, tenantId, userId });
    return record;
  }

  async remove(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id);

    try {
      await this.prisma.generatedContent.update({ where: { id }, data: { status: 'archived' } as any });
    } catch {
      await this.prisma.generatedContent.delete({ where: { id } });
    }

    this.events.emit(DomainEvent.AI_RECORD_DELETED, { entity: 'GeneratedContent', id, tenantId, userId });
    return { message: 'Deleted successfully' };
  }

  async generate(tenantId: string, dto: CreateAiContentGenerationDto, userId: string) {
    const result = await this.aiGateway.invoke('contentgeneration', {
      tenantId,
      userId,
      ...dto,
    });

    const record = await this.prisma.generatedContent.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'GeneratedContent', record, tenantId, userId });
    return { ...result, record };
  }

}
