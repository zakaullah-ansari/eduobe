import { Module } from '@nestjs/common';
import { AiLearningPathNodeService } from './ai-learning-path-node.service';
import { AiLearningPathNodeController } from './ai-learning-path-node.controller';

@Module({
  controllers: [AiLearningPathNodeController],
  providers: [AiLearningPathNodeService],
  exports: [AiLearningPathNodeService],
})
export class AiLearningPathNodeModule {}
