import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { RedisService } from '../redis/redis.service';
import { CreateAiJobDto, UpdateAiJobDto, AiJobQueryDto } from './dto/ai-job.dto';

@Injectable()
export class AiJobService {
  private readonly logger = new Logger(AiJobService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Push a job payload to the Redis channel consumed by the Python
   * background worker (apps/ai-service/app/workers/worker.py).
   */
  private async enqueue(record: any): Promise<void> {
    if (this.config.get<boolean>('ai.enabled', false)) {
      const channel = this.config.get<string>('ai.redisChannel', 'eduobe:ai:jobs');
      try {
        await this.redis.rpush(
          channel,
          JSON.stringify({
            id: record.id,
            jobType: record.jobType,
            payload: record.payload ?? {},
            webhookUrl: `${this.config.get<string>('APP_BASE_URL', 'http://localhost:4000')}/api/v1/ai/webhook`,
          }),
        );
      } catch (error: any) {
        this.logger.warn(`Failed to enqueue AI job ${record.id}: ${error.message}`);
      }
    }
  }

  async create(tenantId: string, dto: CreateAiJobDto, userId: string) {
    const record = await this.prisma.aIJob.create({
      data: {
        ...(dto as any),
        tenantId,
        status: 'queued',
      },
    });

    await this.enqueue(record);
    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'AIJob', record, tenantId, userId });
    return record;
  }

  async findAll(tenantId: string, query: AiJobQueryDto) {
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
      this.prisma.aIJob.findMany({
        where,
        orderBy: { createdAt: 'desc' } as any,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
      this.prisma.aIJob.count({ where }),
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
    const record = await this.prisma.aIJob.findFirst({ where: { id, tenantId } });

    if (!record) {
      throw new NotFoundException('AIJob not found');
    }

    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAiJobDto, userId: string) {
    await this.findOne(tenantId, id);

    const record = await this.prisma.aIJob.update({
      where: { id },
      data: dto as any,
    });

    this.events.emit(DomainEvent.AI_RECORD_UPDATED, { entity: 'AIJob', record, tenantId, userId });
    return record;
  }

  async remove(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id);

    try {
      await this.prisma.aIJob.update({ where: { id }, data: { status: 'archived' } as any });
    } catch {
      await this.prisma.aIJob.delete({ where: { id } });
    }

    this.events.emit(DomainEvent.AI_RECORD_DELETED, { entity: 'AIJob', id, tenantId, userId });
    return { message: 'Deleted successfully' };
  }

  async retry(tenantId: string, id: string, userId: string) {
    const existing = await this.findOne(tenantId, id);
    const record = await this.prisma.aIJob.update({
      where: { id },
      data: {
        status: 'queued',
        attempts: { increment: 1 },
        startedAt: new Date(),
        error: undefined,
        result: undefined,
      },
    });

    await this.enqueue(record);
    this.events.emit(DomainEvent.AI_JOB_UPDATED, {
      jobId: id,
      status: 'queued',
      tenantId,
      userId,
    });
    return { ...record, queued: true };
  }

}
