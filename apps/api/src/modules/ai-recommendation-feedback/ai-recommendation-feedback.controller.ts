import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiRecommendationFeedbackService } from './ai-recommendation-feedback.service';
import { CreateAiRecommendationFeedbackDto, UpdateAiRecommendationFeedbackDto, AiRecommendationFeedbackQueryDto } from './dto/ai-recommendation-feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiRecommendationFeedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/recommendation-feedback')
export class AiRecommendationFeedbackController {
  constructor(private readonly aiRecommendationFeedbackService: AiRecommendationFeedbackService) {}

  @Post()
  @Permissions('ai-recommendation-feedback:create')
  @ApiOperation({ summary: 'Create RecommendationFeedback' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiRecommendationFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationFeedbackService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-recommendation-feedback:read')
  @ApiOperation({ summary: 'List RecommendationFeedbacks' })
  findAll(@TenantId() tenantId: string, @Query() query: AiRecommendationFeedbackQueryDto) {
    return this.aiRecommendationFeedbackService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-recommendation-feedback:read')
  @ApiOperation({ summary: 'Get RecommendationFeedback by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiRecommendationFeedbackService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-recommendation-feedback:update')
  @ApiOperation({ summary: 'Update RecommendationFeedback' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiRecommendationFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationFeedbackService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-recommendation-feedback:delete')
  @ApiOperation({ summary: 'Delete RecommendationFeedback' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationFeedbackService.remove(tenantId, id, userId);
  }

}
