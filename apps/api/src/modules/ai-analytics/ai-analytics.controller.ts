import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiAnalyticsService } from './ai-analytics.service';
import { AnalyticsQueryDto } from './dto/ai-analytics.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/analytics')
export class AiAnalyticsController {
  constructor(private readonly service: AiAnalyticsService) {}

  @Get()
  @Permissions('ai:analytics:read')
  @ApiOperation({ summary: 'AI usage analytics overview' })
  overview(@TenantId() tenantId: string, @Query() query: AnalyticsQueryDto) {
    return this.service.overview(tenantId, query);
  }

  @Get('daily')
  @Permissions('ai:analytics:read')
  @ApiOperation({ summary: 'Daily AI usage breakdown' })
  daily(@TenantId() tenantId: string, @Query() query: AnalyticsQueryDto) {
    return this.service.dailyBreakdown(tenantId, query);
  }
}
