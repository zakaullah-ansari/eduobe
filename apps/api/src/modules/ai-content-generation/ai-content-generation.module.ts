import { Module } from '@nestjs/common';
import { AiContentGenerationService } from './ai-content-generation.service';
import { AiContentGenerationController } from './ai-content-generation.controller';

@Module({
  controllers: [AiContentGenerationController],
  providers: [AiContentGenerationService],
  exports: [AiContentGenerationService],
})
export class AiContentGenerationModule {}
