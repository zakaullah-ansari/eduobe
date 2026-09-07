import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CacheFlushDto } from './dto/ai-cache.dto';

@Injectable()
export class AiCacheService {
  constructor(private readonly redis: RedisService) {}

  async stats(tenantId: string) {
    const client = this.redis.getClient();
    const [total, keys, info] = await Promise.all([
      client.dbsize().catch(() => 0),
      client.keys(`ai:${tenantId}:*`).catch(() => [] as string[]),
      client.info('memory').catch(() => ''),
    ]);
    const dbSize = /used_memory_human:(.*?)\r?\n/.exec(info)?.[1] ?? 'unknown';

    return { totalKeys: total, aiKeys: keys.length, usedMemory: dbSize, tenantId };
  }

  async flush(tenantId: string, dto: CacheFlushDto) {
    const pattern = dto.pattern
      ? dto.pattern
      : dto.namespace
        ? `ai:${tenantId}:${dto.namespace}:*`
        : `ai:${tenantId}:*`;

    const keys = await this.redis.getClient().keys(pattern).catch(() => [] as string[]);
    if (keys.length > 0) {
      await this.redis.getClient().del(...keys).catch(() => undefined);
    }
    return { pattern, deleted: keys.length };
  }
}
