import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiRecommendationService } from './ai-recommendation.service';
import { CreateAiRecommendationDto, UpdateAiRecommendationDto, AiRecommendationQueryDto } from './dto/ai-recommendation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiRecommendation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/recommendations')
export class AiRecommendationController {
  constructor(private readonly aiRecommendationService: AiRecommendationService) {}

  @Post()
  @Permissions('ai-recommendation:create')
  @ApiOperation({ summary: 'Create CourseRecommendation' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiRecommendationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-recommendation:read')
  @ApiOperation({ summary: 'List CourseRecommendations' })
  findAll(@TenantId() tenantId: string, @Query() query: AiRecommendationQueryDto) {
    return this.aiRecommendationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-recommendation:read')
  @ApiOperation({ summary: 'Get CourseRecommendation by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiRecommendationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-recommendation:update')
  @ApiOperation({ summary: 'Update CourseRecommendation' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiRecommendationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-recommendation:delete')
  @ApiOperation({ summary: 'Delete CourseRecommendation' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommendationService.remove(tenantId, id, userId);
  }

}
