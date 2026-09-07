import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiGatewayService } from './ai-gateway.service';
import { AiEngineProbeDto } from './dto/ai-engine.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/engine')
export class AiEngineController {
  constructor(private readonly gateway: AiGatewayService) {}

  @Get('health')
  @Permissions('ai:engine:read')
  @ApiOperation({ summary: 'AI microservice health' })
  async health() {
    return this.gateway.health();
  }

  @Get('capabilities')
  @Permissions('ai:engine:read')
  @ApiOperation({ summary: 'List supported AI capabilities' })
  capabilities() {
    return [
      { feature: 'chatbot', action: 'chat', status: 'ready' },
      { feature: 'recommender', action: 'recommend', status: 'ready' },
      { feature: 'sentiment', action: 'analyze', status: 'ready' },
      { feature: 'content', action: 'generate', status: 'ready' },
      { feature: 'summarization', action: 'summarize', status: 'ready' },
      { feature: 'dropout', action: 'predict', status: 'ready' },
      { feature: 'smart-search', action: 'query', status: 'ready' },
      { feature: 'questions', action: 'generate', status: 'ready' },
      { feature: 'evaluation', action: 'evaluate', status: 'ready' },
      { feature: 'skill-gap', action: 'analyze', status: 'ready' },
      { feature: 'study-plan', action: 'generate', status: 'ready' },
      { feature: 'learning-path', action: 'generate', status: 'ready' },
      { feature: 'insights', action: 'analyze', status: 'ready' },
    ];
  }

  @Post('probe')
  @Permissions('ai:engine:invoke')
  @ApiOperation({ summary: 'Probe the AI service with a raw payload' })
  probe(@TenantId() tenantId: string, @Body() dto: AiEngineProbeDto) {
    return this.gateway.invoke(dto.feature, { tenantId, ...dto.payload });
  }
}
