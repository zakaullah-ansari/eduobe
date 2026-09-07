import { Module } from '@nestjs/common';
import { AiSmartSearchService } from './ai-smart-search.service';
import { AiSmartSearchController } from './ai-smart-search.controller';

@Module({
  controllers: [AiSmartSearchController],
  providers: [AiSmartSearchService],
  exports: [AiSmartSearchService],
})
export class AiSmartSearchModule {}
