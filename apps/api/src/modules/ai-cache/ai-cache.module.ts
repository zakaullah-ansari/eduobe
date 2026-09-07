import { Module } from '@nestjs/common';
import { AiCacheService } from './ai-cache.service';
import { AiCacheController } from './ai-cache.controller';

@Module({
  controllers: [AiCacheController],
  providers: [AiCacheService],
  exports: [AiCacheService],
})
export class AiCacheModule {}
