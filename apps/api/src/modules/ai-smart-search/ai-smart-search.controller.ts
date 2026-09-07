import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiSmartSearchService } from './ai-smart-search.service';
import { CreateAiSmartSearchDto, UpdateAiSmartSearchDto, AiSmartSearchQueryDto } from './dto/ai-smart-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiSmartSearch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/smart-search')
export class AiSmartSearchController {
  constructor(private readonly aiSmartSearchService: AiSmartSearchService) {}

  @Post()
  @Permissions('ai-smart-search:create')
  @ApiOperation({ summary: 'Create SmartSearchQuery' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSmartSearchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSmartSearchService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-smart-search:read')
  @ApiOperation({ summary: 'List SmartSearchQuerys' })
  findAll(@TenantId() tenantId: string, @Query() query: AiSmartSearchQueryDto) {
    return this.aiSmartSearchService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-smart-search:read')
  @ApiOperation({ summary: 'Get SmartSearchQuery by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiSmartSearchService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-smart-search:update')
  @ApiOperation({ summary: 'Update SmartSearchQuery' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiSmartSearchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSmartSearchService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-smart-search:delete')
  @ApiOperation({ summary: 'Delete SmartSearchQuery' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSmartSearchService.remove(tenantId, id, userId);
  }

  @Post('search')
  @Permissions('ai-smart-search:search')
  @ApiOperation({ summary: 'Run smart search' })
  search(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSmartSearchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSmartSearchService.search(tenantId, dto, userId);
  }

}
