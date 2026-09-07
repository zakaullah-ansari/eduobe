import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiStudyPlanService } from './ai-study-plan.service';
import { CreateAiStudyPlanDto, UpdateAiStudyPlanDto, AiStudyPlanQueryDto } from './dto/ai-study-plan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiStudyPlan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/study-plans')
export class AiStudyPlanController {
  constructor(private readonly aiStudyPlanService: AiStudyPlanService) {}

  @Post()
  @Permissions('ai-study-plan:create')
  @ApiOperation({ summary: 'Create PersonalizedStudyPlan' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiStudyPlanDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiStudyPlanService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-study-plan:read')
  @ApiOperation({ summary: 'List PersonalizedStudyPlans' })
  findAll(@TenantId() tenantId: string, @Query() query: AiStudyPlanQueryDto) {
    return this.aiStudyPlanService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-study-plan:read')
  @ApiOperation({ summary: 'Get PersonalizedStudyPlan by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiStudyPlanService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-study-plan:update')
  @ApiOperation({ summary: 'Update PersonalizedStudyPlan' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiStudyPlanDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiStudyPlanService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-study-plan:delete')
  @ApiOperation({ summary: 'Delete PersonalizedStudyPlan' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiStudyPlanService.remove(tenantId, id, userId);
  }

  @Post('generate')
  @Permissions('ai-study-plan:generate')
  @ApiOperation({ summary: 'Generate personalized study plan' })
  generate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiStudyPlanDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiStudyPlanService.generate(tenantId, dto, userId);
  }

}
