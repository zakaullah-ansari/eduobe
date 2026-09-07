import { Global, Module } from '@nestjs/common';
import { AiGatewayService } from './ai-gateway.service';
import { AiEngineController } from './ai-engine.controller';

@Global()
@Module({
  controllers: [AiEngineController],
  providers: [AiGatewayService],
  exports: [AiGatewayService],
})
export class AiEngineModule {}
