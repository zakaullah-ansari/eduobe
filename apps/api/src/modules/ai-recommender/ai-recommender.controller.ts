import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiRecommenderService } from './ai-recommender.service';
import { CreateAiRecommenderDto, UpdateAiRecommenderDto, AiRecommenderQueryDto } from './dto/ai-recommender.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiRecommender')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/recommender')
export class AiRecommenderController {
  constructor(private readonly aiRecommenderService: AiRecommenderService) {}

  @Post()
  @Permissions('ai-recommender:create')
  @ApiOperation({ summary: 'Create CourseRecommendation' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiRecommenderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommenderService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-recommender:read')
  @ApiOperation({ summary: 'List CourseRecommendations' })
  findAll(@TenantId() tenantId: string, @Query() query: AiRecommenderQueryDto) {
    return this.aiRecommenderService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-recommender:read')
  @ApiOperation({ summary: 'Get CourseRecommendation by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiRecommenderService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-recommender:update')
  @ApiOperation({ summary: 'Update CourseRecommendation' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiRecommenderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommenderService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-recommender:delete')
  @ApiOperation({ summary: 'Delete CourseRecommendation' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommenderService.remove(tenantId, id, userId);
  }

  @Post('generate')
  @Permissions('ai-recommender:generate')
  @ApiOperation({ summary: 'Generate course recommendations' })
  generate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiRecommenderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiRecommenderService.generate(tenantId, dto, userId);
  }

}
