import { Module } from '@nestjs/common';
import { AiPromptService } from './ai-prompt.service';
import { AiPromptController } from './ai-prompt.controller';

@Module({
  controllers: [AiPromptController],
  providers: [AiPromptService],
  exports: [AiPromptService],
})
export class AiPromptModule {}
