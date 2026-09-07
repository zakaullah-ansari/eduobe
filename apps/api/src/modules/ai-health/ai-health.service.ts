import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';

@Injectable()
export class AiHealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AiGatewayService,
  ) {}

  async overview(tenantId: string) {
    const [conversations, messages, jobs, usageLogs, aiService] = await Promise.all([
      this.prisma.aIConversation.count({ where: { tenantId } }),
      this.prisma.aIMessage.count({ where: { tenantId } }),
      this.prisma.aIJob.count({ where: { tenantId } }),
      this.prisma.aIUsageLog.count({ where: { tenantId } }),
      this.gateway.health(),
    ]);

    return {
      aiService,
      counts: { conversations, messages, jobs, usageLogs },
    };
  }
}
