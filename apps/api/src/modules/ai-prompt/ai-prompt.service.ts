import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertPromptDto, PromptQueryDto } from './dto/ai-prompt.dto';

/**
 * Prompt template management. Templates are stored on the per-tenant
 * AIConfiguration row under `prompts` (a JSON object keyed by prompt key).
 */
@Injectable()
export class AiPromptService {
  constructor(private readonly prisma: PrismaService) {}

  private async getConfig(tenantId: string) {
    let config = await this.prisma.aIConfiguration.findUnique({ where: { tenantId } });
    if (!config) {
      config = await this.prisma.aIConfiguration.create({ data: { tenantId } });
    }
    return config;
  }

  async list(tenantId: string, query: PromptQueryDto) {
    const config = await this.getConfig(tenantId);
    const prompts: Record<string, any> = (config.prompts as Record<string, any>) ?? {};

    let entries = Object.entries(prompts).map(([key, value]) => ({ key, ...value }));

    if (query.search) {
      entries = entries.filter((e) => e.key.includes(query.search));
    }
    if (query.category) {
      entries = entries.filter((e) => e.category === query.category);
    }

    return entries;
  }

  async upsert(tenantId: string, dto: UpsertPromptDto) {
    const config = await this.getConfig(tenantId);
    const prompts = { ...((config.prompts as Record<string, any>) ?? {}) };

    prompts[dto.key] = {
      template: dto.template,
      variables: dto.variables?.split(',').map((v) => v.trim()) ?? [],
      maxTokens: dto.maxTokens ?? 2000,
      temperature: dto.temperature ?? 0.7,
      enabled: dto.enabled ?? true,
      updatedAt: new Date().toISOString(),
    };

    await this.prisma.aIConfiguration.update({
      where: { id: config.id },
      data: { prompts },
    });

    return { key: dto.key, ...prompts[dto.key] };
  }

  async remove(tenantId: string, key: string) {
    const config = await this.getConfig(tenantId);
    const prompts = { ...((config.prompts as Record<string, any>) ?? {}) };

    if (!prompts[key]) {
      throw new NotFoundException(`Prompt "${key}" not found`);
    }

    delete prompts[key];
    await this.prisma.aIConfiguration.update({
      where: { id: config.id },
      data: { prompts },
    });

    return { deleted: key };
  }
}
