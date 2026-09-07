import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelConfigDto } from './dto/ai-model.dto';

/**
 * Per-tenant AI model registry. Stores the active model, sampling
 * parameters and guardrails on the AIConfiguration row.
 */
@Injectable()
export class AiModelService {
  constructor(private readonly prisma: PrismaService) {}

  private async getConfig(tenantId: string) {
    let config = await this.prisma.aIConfiguration.findUnique({ where: { tenantId } });
    if (!config) {
      config = await this.prisma.aIConfiguration.create({ data: { tenantId } });
    }
    return config;
  }

  async get(tenantId: string) {
    const config = await this.getConfig(tenantId);
    return {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      guardrails: config.guardrails,
      chatbotEnabled: config.chatbotEnabled,
      dataRetentionDays: config.dataRetentionDays,
    };
  }

  async update(tenantId: string, dto: ModelConfigDto) {
    const config = await this.getConfig(tenantId);
    const updated = await this.prisma.aIConfiguration.update({
      where: { id: config.id },
      data: {
        model: dto.model ?? config.model,
        temperature: dto.temperature ?? config.temperature,
        maxTokens: dto.maxTokens ?? config.maxTokens,
        guardrails: (dto.guardrails ?? config.guardrails) as any,
      },
    });

    return {
      model: updated.model,
      temperature: updated.temperature,
      maxTokens: updated.maxTokens,
      guardrails: updated.guardrails,
    };
  }
}
