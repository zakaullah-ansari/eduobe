import { Module } from '@nestjs/common';
import { AiMessageService } from './ai-message.service';
import { AiMessageController } from './ai-message.controller';

@Module({
  controllers: [AiMessageController],
  providers: [AiMessageService],
  exports: [AiMessageService],
})
export class AiMessageModule {}
