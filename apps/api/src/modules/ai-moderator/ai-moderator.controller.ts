import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiModeratorService } from './ai-moderator.service';
import { ModerateTextDto } from './dto/ai-moderator.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Moderator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/moderator')
export class AiModeratorController {
  constructor(private readonly service: AiModeratorService) {}

  @Post()
  @Permissions('ai:moderator:invoke')
  @ApiOperation({ summary: 'Moderate text before/after AI processing' })
  moderate(@TenantId() tenantId: string, @Body() dto: ModerateTextDto) {
    return this.service.moderate(tenantId, dto);
  }
}
