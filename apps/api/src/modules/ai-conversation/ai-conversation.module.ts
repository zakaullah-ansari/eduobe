import { Module } from '@nestjs/common';
import { AiConversationService } from './ai-conversation.service';
import { AiConversationController } from './ai-conversation.controller';

@Module({
  controllers: [AiConversationController],
  providers: [AiConversationService],
  exports: [AiConversationService],
})
export class AiConversationModule {}
