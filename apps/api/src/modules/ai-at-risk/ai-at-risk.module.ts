import { Module } from '@nestjs/common';
import { AiAtRiskService } from './ai-at-risk.service';
import { AiAtRiskController } from './ai-at-risk.controller';

@Module({
  controllers: [AiAtRiskController],
  providers: [AiAtRiskService],
  exports: [AiAtRiskService],
})
export class AiAtRiskModule {}
