import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiCacheService } from './ai-cache.service';
import { CacheFlushDto } from './dto/ai-cache.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Cache')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/cache')
export class AiCacheController {
  constructor(private readonly service: AiCacheService) {}

  @Get()
  @Permissions('ai:cache:read')
  @ApiOperation({ summary: 'AI cache statistics' })
  stats(@TenantId() tenantId: string) {
    return this.service.stats(tenantId);
  }

  @Delete()
  @Permissions('ai:cache:flush')
  @ApiOperation({ summary: 'Flush tenant AI cache' })
  flush(@TenantId() tenantId: string, @Body() dto: CacheFlushDto) {
    return this.service.flush(tenantId, dto);
  }
}
