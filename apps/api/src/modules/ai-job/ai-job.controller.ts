import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiJobService } from './ai-job.service';
import { CreateAiJobDto, UpdateAiJobDto, AiJobQueryDto } from './dto/ai-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiJob')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/jobs')
export class AiJobController {
  constructor(private readonly aiJobService: AiJobService) {}

  @Post()
  @Permissions('ai-job:create')
  @ApiOperation({ summary: 'Create AIJob' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiJobDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiJobService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-job:read')
  @ApiOperation({ summary: 'List AIJobs' })
  findAll(@TenantId() tenantId: string, @Query() query: AiJobQueryDto) {
    return this.aiJobService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-job:read')
  @ApiOperation({ summary: 'Get AIJob by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiJobService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-job:update')
  @ApiOperation({ summary: 'Update AIJob' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiJobDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiJobService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-job:delete')
  @ApiOperation({ summary: 'Delete AIJob' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiJobService.remove(tenantId, id, userId);
  }

  @Post(':id/retry')
  @Permissions('ai-job:retry')
  @ApiOperation({ summary: 'Retry an AI job' })
  retry(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiJobService.retry(tenantId, id, userId);
  }

}
