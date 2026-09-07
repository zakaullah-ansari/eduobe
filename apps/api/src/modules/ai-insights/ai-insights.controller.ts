import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiInsightsService } from './ai-insights.service';
import { InsightsQueryDto, SentimentSummaryDto } from './dto/ai-insights.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/insights')
export class AiInsightsController {
  constructor(private readonly service: AiInsightsService) {}

  @Get()
  @Permissions('ai:insights:read')
  @ApiOperation({ summary: 'AI insights dashboard' })
  insights(@TenantId() tenantId: string, @Query() query: InsightsQueryDto) {
    return this.service.insights(tenantId, query);
  }

  @Post('sentiment-summary')
  @Permissions('ai:insights:invoke')
  @ApiOperation({ summary: 'Generate an AI summary of collected feedback' })
  sentimentSummary(@TenantId() tenantId: string, @Body() dto: SentimentSummaryDto) {
    return this.service.sentimentSummary(tenantId, dto);
  }
}
