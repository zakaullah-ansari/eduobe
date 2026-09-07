import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { DomainEvent } from '../event/event.service';

/**
 * Domain event consumer. When core EduOBE events fire we queue
 * AI work (async via AIJob rows) instead of blocking the request.
 * The Python worker (apps/ai-service/workers/worker.py) picks jobs
 * up from Redis and callbacks arrive on /ai/webhook.
 */
@Injectable()
export class AiEventConsumerService {
  private readonly logger = new Logger(AiEventConsumerService.name);
  private readonly handled = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AiGatewayService,
  ) {}

  @OnEvent(DomainEvent.ATTENDANCE_MARKED)
  async onAttendanceMarked(payload: Record<string, any>) {
    await this.enqueue('dropout_batch', payload, payload.tenantId);
    this.handled.add(`${DomainEvent.ATTENDANCE_MARKED}:${payload.tenantId}`);
  }

  @OnEvent(DomainEvent.MARKS_ENTERED)
  async onMarksEntered(payload: Record<string, any>) {
    await this.enqueue('dropout_batch', payload, payload.tenantId);
    this.handled.add(`${DomainEvent.MARKS_ENTERED}:${payload.tenantId}`);
  }

  @OnEvent(DomainEvent.FEEDBACK_RECEIVED)
  async onFeedbackReceived(payload: Record<string, any>) {
    await this.enqueue('sentiment_batch', payload, payload.tenantId);
    this.handled.add(`${DomainEvent.FEEDBACK_RECEIVED}:${payload.tenantId}`);
  }

  @OnEvent(DomainEvent.STUDENT_PROMOTED)
  async onStudentPromoted(payload: Record<string, any>) {
    await this.enqueue('recommendation_batch', payload, payload.tenantId);
    this.handled.add(`${DomainEvent.STUDENT_PROMOTED}:${payload.tenantId}`);
  }

  @OnEvent(DomainEvent.SURVEY_RESPONSE_SUBMITTED)
  async onSurveyResponse(payload: Record<string, any>) {
    await this.enqueue('sentiment_batch', payload, payload.tenantId);
    this.handled.add(`${DomainEvent.SURVEY_RESPONSE_SUBMITTED}:${payload.tenantId}`);
  }

  async enqueue(jobType: string, payload: Record<string, any>, tenantId: string) {
    try {
      const job = await this.prisma.aIJob.create({
        data: {
          tenantId: tenantId ?? 'system',
          jobType: jobType as any,
          payload,
          status: 'queued',
        },
      });
      this.logger.log(`Enqueued AI job ${job.id} (${jobType})`);
      return job;
    } catch (error: any) {
      this.logger.warn(`Failed to enqueue AI job ${jobType}: ${error.message}`);
      return null;
    }
  }

  status() {
    return {
      listeners: [
        DomainEvent.ATTENDANCE_MARKED,
        DomainEvent.MARKS_ENTERED,
        DomainEvent.FEEDBACK_RECEIVED,
        DomainEvent.STUDENT_PROMOTED,
        DomainEvent.SURVEY_RESPONSE_SUBMITTED,
      ],
      fired: Array.from(this.handled),
      gatewayEnabled: this.gateway.isEnabled,
    };
  }
}
