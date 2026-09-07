import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiHealthService } from './ai-health.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/health')
export class AiHealthController {
  constructor(private readonly service: AiHealthService) {}

  @Get()
  @Permissions('ai:health:read')
  @ApiOperation({ summary: 'AI system health overview' })
  overview(@TenantId() tenantId: string) {
    return this.service.overview(tenantId);
  }
}
