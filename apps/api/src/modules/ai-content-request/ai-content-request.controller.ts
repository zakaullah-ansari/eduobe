import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiContentRequestService } from './ai-content-request.service';
import { CreateAiContentRequestDto, UpdateAiContentRequestDto, AiContentRequestQueryDto } from './dto/ai-content-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiContentRequest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/content-requests')
export class AiContentRequestController {
  constructor(private readonly aiContentRequestService: AiContentRequestService) {}

  @Post()
  @Permissions('ai-content-request:create')
  @ApiOperation({ summary: 'Create ContentGenerationRequest' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiContentRequestDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentRequestService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-content-request:read')
  @ApiOperation({ summary: 'List ContentGenerationRequests' })
  findAll(@TenantId() tenantId: string, @Query() query: AiContentRequestQueryDto) {
    return this.aiContentRequestService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-content-request:read')
  @ApiOperation({ summary: 'Get ContentGenerationRequest by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiContentRequestService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-content-request:update')
  @ApiOperation({ summary: 'Update ContentGenerationRequest' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiContentRequestDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentRequestService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-content-request:delete')
  @ApiOperation({ summary: 'Delete ContentGenerationRequest' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentRequestService.remove(tenantId, id, userId);
  }

}
