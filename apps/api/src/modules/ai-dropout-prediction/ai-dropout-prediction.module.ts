import { Module } from '@nestjs/common';
import { AiDropoutPredictionService } from './ai-dropout-prediction.service';
import { AiDropoutPredictionController } from './ai-dropout-prediction.controller';

@Module({
  controllers: [AiDropoutPredictionController],
  providers: [AiDropoutPredictionService],
  exports: [AiDropoutPredictionService],
})
export class AiDropoutPredictionModule {}
