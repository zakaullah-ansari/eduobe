import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiSearchFeedbackService } from './ai-search-feedback.service';
import { CreateAiSearchFeedbackDto, UpdateAiSearchFeedbackDto, AiSearchFeedbackQueryDto } from './dto/ai-search-feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiSearchFeedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/search-feedback')
export class AiSearchFeedbackController {
  constructor(private readonly aiSearchFeedbackService: AiSearchFeedbackService) {}

  @Post()
  @Permissions('ai-search-feedback:create')
  @ApiOperation({ summary: 'Create SearchResultFeedback' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSearchFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSearchFeedbackService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-search-feedback:read')
  @ApiOperation({ summary: 'List SearchResultFeedbacks' })
  findAll(@TenantId() tenantId: string, @Query() query: AiSearchFeedbackQueryDto) {
    return this.aiSearchFeedbackService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-search-feedback:read')
  @ApiOperation({ summary: 'Get SearchResultFeedback by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiSearchFeedbackService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-search-feedback:update')
  @ApiOperation({ summary: 'Update SearchResultFeedback' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiSearchFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSearchFeedbackService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-search-feedback:delete')
  @ApiOperation({ summary: 'Delete SearchResultFeedback' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSearchFeedbackService.remove(tenantId, id, userId);
  }

}
