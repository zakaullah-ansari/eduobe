import { Module } from '@nestjs/common';
import { AiLearningPathService } from './ai-learning-path.service';
import { AiLearningPathController } from './ai-learning-path.controller';

@Module({
  controllers: [AiLearningPathController],
  providers: [AiLearningPathService],
  exports: [AiLearningPathService],
})
export class AiLearningPathModule {}
