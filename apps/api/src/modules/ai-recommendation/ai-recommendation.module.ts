import { Module } from '@nestjs/common';
import { AiRecommendationService } from './ai-recommendation.service';
import { AiRecommendationController } from './ai-recommendation.controller';

@Module({
  controllers: [AiRecommendationController],
  providers: [AiRecommendationService],
  exports: [AiRecommendationService],
})
export class AiRecommendationModule {}
