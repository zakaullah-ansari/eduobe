import { Module } from '@nestjs/common';
import { AiEmbeddingService } from './ai-embedding.service';
import { AiEmbeddingController } from './ai-embedding.controller';

@Module({
  controllers: [AiEmbeddingController],
  providers: [AiEmbeddingService],
  exports: [AiEmbeddingService],
})
export class AiEmbeddingModule {}
