import { Module } from '@nestjs/common';
import { AiSkillGapService } from './ai-skill-gap.service';
import { AiSkillGapController } from './ai-skill-gap.controller';

@Module({
  controllers: [AiSkillGapController],
  providers: [AiSkillGapService],
  exports: [AiSkillGapService],
})
export class AiSkillGapModule {}
