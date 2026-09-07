import { Module } from '@nestjs/common';
import { AiStudyPlanService } from './ai-study-plan.service';
import { AiStudyPlanController } from './ai-study-plan.controller';

@Module({
  controllers: [AiStudyPlanController],
  providers: [AiStudyPlanService],
  exports: [AiStudyPlanService],
})
export class AiStudyPlanModule {}
