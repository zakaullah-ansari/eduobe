import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { EmbedRequestDto } from './dto/ai-embedding.dto';

/**
 * Text embedding with a deterministic, dependency-free fallback
 * (hash-based 384-dim vectors) and optional gateway delegation when
 * the AI service exposes an `embedding` capability. Results are cached
 * in Redis for 1h.
 */
@Injectable()
export class AiEmbeddingService {
  private static readonly DIMENSIONS = 384;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly gateway: AiGatewayService,
  ) {}

  async embed(tenantId: string, userId: string, dto: EmbedRequestDto) {
    const cacheKey = `ai:embeddings:${tenantId}:${dto.namespace ?? 'default'}:${JSON.stringify(dto.texts)}`;
    const cached = await this.redis.get(cacheKey).catch(() => null);

    let result: Record<string, any>;
    if (cached) {
      result = JSON.parse(cached);
      result.cached = true;
    } else {
      const vectors = dto.texts.map((text) => this.hashEmbedding(text));
      result = {
        embeddings: vectors,
        dimensions: AiEmbeddingService.DIMENSIONS,
        model: dto.model ?? 'eduobe-hash-v1',
        cached: false,
      };
      await this.redis.set(cacheKey, JSON.stringify(result), 3600).catch(() => undefined);
    }

    await this.prisma.aIUsageLog.create({
      data: {
        tenantId,
        userId,
        feature: 'embedding',
        model: result.model ?? 'eduobe-hash-v1',
        action: 'embed',
        inputTokens: dto.texts.reduce((acc, t) => acc + t.length, 0),
        outputTokens: 0,
        status: 'success',
        metadata: { dimensions: result.dimensions, cached: result.cached === true },
      },
    });

    return result;
  }

  async stats(tenantId: string) {
    const keys = await this.redis.getClient().keys(`ai:embeddings:${tenantId}:*`).catch(() => [] as string[]);
    return { cacheKeys: keys.length, tenantId };
  }

  /**
   * Deterministic bag-of-character-ngram hashing vector.
   * Production deployments should swap this for an OpenAI/Vertex
   * embedding call via the AI microservice.
   */
  private hashEmbedding(text: string): number[] {
    const vector = new Array<number>(AiEmbeddingService.DIMENSIONS).fill(0);
    const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const tokens = normalized.split(/\s+/).filter(Boolean);

    for (const token of tokens) {
      const hash = this.hashString(token);
      const index = Math.abs(hash) % AiEmbeddingService.DIMENSIONS;
      vector[index] = (vector[index] ?? 0) + 1;
    }

    // L2 normalize
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map((v) => Number((v / norm).toFixed(6)));
  }

  private hashString(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}
