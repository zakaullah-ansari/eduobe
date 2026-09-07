import { Module } from '@nestjs/common';
import { AiAnswerEvaluationService } from './ai-answer-evaluation.service';
import { AiAnswerEvaluationController } from './ai-answer-evaluation.controller';

@Module({
  controllers: [AiAnswerEvaluationController],
  providers: [AiAnswerEvaluationService],
  exports: [AiAnswerEvaluationService],
})
export class AiAnswerEvaluationModule {}
