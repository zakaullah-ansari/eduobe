import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { CreateAiSentimentDto, UpdateAiSentimentDto, AiSentimentQueryDto } from './dto/ai-sentiment.dto';

@Injectable()
export class AiSentimentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async create(tenantId: string, dto: CreateAiSentimentDto, userId: string) {
    const record = await this.prisma.sentimentAnalysis.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'SentimentAnalysis', record, tenantId, userId });
    return record;
  }

  async findAll(tenantId: string, query: AiSentimentQueryDto) {
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
      this.prisma.sentimentAnalysis.findMany({
        where,
        orderBy: { createdAt: 'desc' } as any,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
      this.prisma.sentimentAnalysis.count({ where }),
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
    const record = await this.prisma.sentimentAnalysis.findFirst({ where: { id, tenantId } });

    if (!record) {
      throw new NotFoundException('SentimentAnalysis not found');
    }

    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAiSentimentDto, userId: string) {
    await this.findOne(tenantId, id);

    const record = await this.prisma.sentimentAnalysis.update({
      where: { id },
      data: dto as any,
    });

    this.events.emit(DomainEvent.AI_RECORD_UPDATED, { entity: 'SentimentAnalysis', record, tenantId, userId });
    return record;
  }

  async remove(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id);

    try {
      await this.prisma.sentimentAnalysis.update({ where: { id }, data: { status: 'archived' } as any });
    } catch {
      await this.prisma.sentimentAnalysis.delete({ where: { id } });
    }

    this.events.emit(DomainEvent.AI_RECORD_DELETED, { entity: 'SentimentAnalysis', id, tenantId, userId });
    return { message: 'Deleted successfully' };
  }

  async analyze(tenantId: string, dto: CreateAiSentimentDto, userId: string) {
    const result = await this.aiGateway.invoke('sentiment', {
      tenantId,
      userId,
      ...dto,
    });

    const record = await this.prisma.sentimentAnalysis.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'SentimentAnalysis', record, tenantId, userId });
    return { ...result, record };
  }

}
