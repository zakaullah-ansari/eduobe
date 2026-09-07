import { Module } from '@nestjs/common';
import { AiChatbotConfigService } from './ai-chatbot-config.service';
import { AiChatbotConfigController } from './ai-chatbot-config.controller';

@Module({
  controllers: [AiChatbotConfigController],
  providers: [AiChatbotConfigService],
  exports: [AiChatbotConfigService],
})
export class AiChatbotConfigModule {}
