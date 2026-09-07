import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiAtRiskService } from './ai-at-risk.service';
import { CreateAiAtRiskDto, UpdateAiAtRiskDto, AiAtRiskQueryDto } from './dto/ai-at-risk.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiAtRisk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/at-risk')
export class AiAtRiskController {
  constructor(private readonly aiAtRiskService: AiAtRiskService) {}

  @Post()
  @Permissions('ai-at-risk:create')
  @ApiOperation({ summary: 'Create AtRiskStudent' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiAtRiskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAtRiskService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-at-risk:read')
  @ApiOperation({ summary: 'List AtRiskStudents' })
  findAll(@TenantId() tenantId: string, @Query() query: AiAtRiskQueryDto) {
    return this.aiAtRiskService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-at-risk:read')
  @ApiOperation({ summary: 'Get AtRiskStudent by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiAtRiskService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-at-risk:update')
  @ApiOperation({ summary: 'Update AtRiskStudent' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiAtRiskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAtRiskService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-at-risk:delete')
  @ApiOperation({ summary: 'Delete AtRiskStudent' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAtRiskService.remove(tenantId, id, userId);
  }

  @Post('refresh')
  @Permissions('ai-at-risk:refresh')
  @ApiOperation({ summary: 'Refresh at-risk student list' })
  refresh(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiAtRiskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAtRiskService.refresh(tenantId, dto, userId);
  }

}
