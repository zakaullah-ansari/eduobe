import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiLearningPathService } from './ai-learning-path.service';
import { CreateAiLearningPathDto, UpdateAiLearningPathDto, AiLearningPathQueryDto } from './dto/ai-learning-path.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiLearningPath')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/learning-paths')
export class AiLearningPathController {
  constructor(private readonly aiLearningPathService: AiLearningPathService) {}

  @Post()
  @Permissions('ai-learning-path:create')
  @ApiOperation({ summary: 'Create LearningPath' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiLearningPathDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-learning-path:read')
  @ApiOperation({ summary: 'List LearningPaths' })
  findAll(@TenantId() tenantId: string, @Query() query: AiLearningPathQueryDto) {
    return this.aiLearningPathService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-learning-path:read')
  @ApiOperation({ summary: 'Get LearningPath by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiLearningPathService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-learning-path:update')
  @ApiOperation({ summary: 'Update LearningPath' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiLearningPathDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-learning-path:delete')
  @ApiOperation({ summary: 'Delete LearningPath' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathService.remove(tenantId, id, userId);
  }

  @Post('generate')
  @Permissions('ai-learning-path:generate')
  @ApiOperation({ summary: 'Generate AI learning path' })
  generate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiLearningPathDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathService.generate(tenantId, dto, userId);
  }

}
