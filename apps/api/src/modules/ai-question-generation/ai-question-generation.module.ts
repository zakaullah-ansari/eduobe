import { Module } from '@nestjs/common';
import { AiQuestionGenerationService } from './ai-question-generation.service';
import { AiQuestionGenerationController } from './ai-question-generation.controller';

@Module({
  controllers: [AiQuestionGenerationController],
  providers: [AiQuestionGenerationService],
  exports: [AiQuestionGenerationService],
})
export class AiQuestionGenerationModule {}
