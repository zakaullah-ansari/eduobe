import { Module } from '@nestjs/common';
import { AiSearchFeedbackService } from './ai-search-feedback.service';
import { AiSearchFeedbackController } from './ai-search-feedback.controller';

@Module({
  controllers: [AiSearchFeedbackController],
  providers: [AiSearchFeedbackService],
  exports: [AiSearchFeedbackService],
})
export class AiSearchFeedbackModule {}
