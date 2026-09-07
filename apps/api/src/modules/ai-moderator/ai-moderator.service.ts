import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { ModerateTextDto } from './dto/ai-moderator.dto';

const BLOCKED_PATTERNS = [
  /\b(hate speech|violence|terrorism)\b/i,
  /\b(credit card|ssn|aadhaar)\s*\d+\b/i,
];

const SENSITIVE_TOPICS = ['politics', 'religion', 'racism', 'harassment'];

/**
 * Rule-based guardrail layer for all AI surfaces. Kept local for low
 * latency; can optionally be escalated to the gateway moderation
 * capability when available.
 */
@Injectable()
export class AiModeratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AiGatewayService,
  ) {}

  async moderate(tenantId: string, dto: ModerateTextDto) {
    const threshold = dto.threshold ?? 0.6;
    const blocked: string[] = [];
    const sensitive: string[] = [];

    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(dto.text)) {
        blocked.push(pattern.source);
      }
    }

    for (const topic of SENSITIVE_TOPICS) {
      if (new RegExp(`\\b${topic}\\b`, 'i').test(dto.text)) {
        sensitive.push(topic);
      }
    }

    let gateway = null;
    if (dto.useGateway) {
      gateway = await this.gateway
        .invoke('moderation', { text: dto.text, context: dto.context })
        .then((r) => r.result ?? r)
        .catch(() => null);
    }

    const flagged = blocked.length > 0 || sensitive.length > 0;
    const score = Math.min(1, (blocked.length + sensitive.length * 0.5) / 2);

    await this.prisma.aIUsageLog.create({
      data: {
        tenantId,
        feature: 'moderator',
        action: 'moderate',
        status: flagged ? 'success' : 'success',
        metadata: { flagged, score, blocked, sensitive, context: dto.context },
      },
    });

    return {
      flagged,
      allowed: !flagged && score < threshold,
      score: Number(score.toFixed(2)),
      blocked,
      sensitive,
      gateway,
      policy: 'eduobe-guardrails-v1',
    };
  }
}
