import { Module } from '@nestjs/common';
import { AiRecommenderService } from './ai-recommender.service';
import { AiRecommenderController } from './ai-recommender.controller';

@Module({
  controllers: [AiRecommenderController],
  providers: [AiRecommenderService],
  exports: [AiRecommenderService],
})
export class AiRecommenderModule {}
