import { Module } from '@nestjs/common';
import { AiHealthService } from './ai-health.service';
import { AiHealthController } from './ai-health.controller';

@Module({
  controllers: [AiHealthController],
  providers: [AiHealthService],
  exports: [AiHealthService],
})
export class AiHealthModule {}
