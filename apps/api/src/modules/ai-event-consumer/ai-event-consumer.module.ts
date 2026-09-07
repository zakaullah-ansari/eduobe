import { Module } from '@nestjs/common';
import { AiEventConsumerService } from './ai-event-consumer.service';
import { AiEventConsumerController } from './ai-event-consumer.controller';

@Module({
  controllers: [AiEventConsumerController],
  providers: [AiEventConsumerService],
  exports: [AiEventConsumerService],
})
export class AiEventConsumerModule {}
