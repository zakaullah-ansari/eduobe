import { Module } from '@nestjs/common';
import { AiJobService } from './ai-job.service';
import { AiJobController } from './ai-job.controller';

@Module({
  controllers: [AiJobController],
  providers: [AiJobService],
  exports: [AiJobService],
})
export class AiJobModule {}
