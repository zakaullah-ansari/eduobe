import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiWebhookEventDto } from './dto/ai-webhook.dto';

/**
 * Receives async job callbacks from the Python AI microservice
 * (batch sentiment, dropout, recommendations, embeddings, ...).
 * Protected by X-AI-Service-Key.
 */
@Injectable()
export class AiWebhookService {
  private readonly logger = new Logger(AiWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly config: ConfigService,
  ) {}

  verifyKey(apiKey: string | undefined): void {
    const expected = this.config.get<string>('ai.serviceApiKey', '');
    if (!expected) {
      return; // key disabled in development
    }
    if (apiKey !== expected) {
      throw new ForbiddenException('Invalid AI service key');
    }
  }

  async handle(dto: AiWebhookEventDto) {
    this.logger.log(`AI webhook: ${dto.jobType} ${dto.jobId ?? ''} -> ${dto.status ?? 'unknown'}`);

    const job = dto.jobId
      ? await this.prisma.aIJob.findFirst({ where: { id: dto.jobId } })
      : null;

    if (job) {
      await this.prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: (dto.status ?? 'running') as any,
          result: dto.result ?? undefined,
          error: dto.error ?? undefined,
          completedAt: dto.status === 'completed' ? new Date() : undefined,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.aIJob.create({
        data: {
          tenantId: dto.payload?.tenantId ?? 'system',
          jobType: dto.jobType as any,
          payload: dto.payload ?? {},
          status: (dto.status ?? 'completed') as any,
          result: dto.result ?? undefined,
          error: dto.error ?? undefined,
          completedAt: dto.status === 'completed' ? new Date() : undefined,
        },
      });
    }

    this.events.emit(DomainEvent.AI_JOB_UPDATED, {
      jobType: dto.jobType,
      jobId: dto.jobId,
      status: dto.status ?? 'completed',
      tenantId: dto.payload?.tenantId,
    });

    return { received: true };
  }
}
