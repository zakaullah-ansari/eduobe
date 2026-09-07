import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiUsageService } from './ai-usage.service';
import { CreateAiUsageDto, UpdateAiUsageDto, AiUsageQueryDto } from './dto/ai-usage.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiUsage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/usage')
export class AiUsageController {
  constructor(private readonly aiUsageService: AiUsageService) {}

  @Post()
  @Permissions('ai-usage:create')
  @ApiOperation({ summary: 'Create AIUsageLog' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiUsageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiUsageService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-usage:read')
  @ApiOperation({ summary: 'List AIUsageLogs' })
  findAll(@TenantId() tenantId: string, @Query() query: AiUsageQueryDto) {
    return this.aiUsageService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-usage:read')
  @ApiOperation({ summary: 'Get AIUsageLog by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiUsageService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-usage:update')
  @ApiOperation({ summary: 'Update AIUsageLog' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiUsageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiUsageService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-usage:delete')
  @ApiOperation({ summary: 'Delete AIUsageLog' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiUsageService.remove(tenantId, id, userId);
  }

}
