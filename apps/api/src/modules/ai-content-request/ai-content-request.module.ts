import { Module } from '@nestjs/common';
import { AiContentRequestService } from './ai-content-request.service';
import { AiContentRequestController } from './ai-content-request.controller';

@Module({
  controllers: [AiContentRequestController],
  providers: [AiContentRequestService],
  exports: [AiContentRequestService],
})
export class AiContentRequestModule {}
