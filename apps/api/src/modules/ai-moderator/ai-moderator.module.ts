import { Module } from '@nestjs/common';
import { AiModeratorService } from './ai-moderator.service';
import { AiModeratorController } from './ai-moderator.controller';

@Module({
  controllers: [AiModeratorController],
  providers: [AiModeratorService],
  exports: [AiModeratorService],
})
export class AiModeratorModule {}
