import { Module } from '@nestjs/common';
import { AiSentimentService } from './ai-sentiment.service';
import { AiSentimentController } from './ai-sentiment.controller';

@Module({
  controllers: [AiSentimentController],
  providers: [AiSentimentService],
  exports: [AiSentimentService],
})
export class AiSentimentModule {}
