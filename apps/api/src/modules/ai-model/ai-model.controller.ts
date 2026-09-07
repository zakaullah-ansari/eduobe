import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiModelService } from './ai-model.service';
import { ModelConfigDto } from './dto/ai-model.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Model Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/models')
export class AiModelController {
  constructor(private readonly service: AiModelService) {}

  @Get()
  @Permissions('ai:models:read')
  @ApiOperation({ summary: 'Get current AI model configuration' })
  get(@TenantId() tenantId: string) {
    return this.service.get(tenantId);
  }

  @Put()
  @Permissions('ai:models:write')
  @ApiOperation({ summary: 'Update AI model configuration' })
  update(@TenantId() tenantId: string, @Body() dto: ModelConfigDto) {
    return this.service.update(tenantId, dto);
  }
}
