import { Module } from '@nestjs/common';
import { AiRecommendationFeedbackService } from './ai-recommendation-feedback.service';
import { AiRecommendationFeedbackController } from './ai-recommendation-feedback.controller';

@Module({
  controllers: [AiRecommendationFeedbackController],
  providers: [AiRecommendationFeedbackService],
  exports: [AiRecommendationFeedbackService],
})
export class AiRecommendationFeedbackModule {}
