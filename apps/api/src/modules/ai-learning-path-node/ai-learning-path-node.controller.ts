import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiLearningPathNodeService } from './ai-learning-path-node.service';
import { CreateAiLearningPathNodeDto, UpdateAiLearningPathNodeDto, AiLearningPathNodeQueryDto } from './dto/ai-learning-path-node.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiLearningPathNode')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/learning-path-nodes')
export class AiLearningPathNodeController {
  constructor(private readonly aiLearningPathNodeService: AiLearningPathNodeService) {}

  @Post()
  @Permissions('ai-learning-path-node:create')
  @ApiOperation({ summary: 'Create LearningPathNode' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiLearningPathNodeDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathNodeService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-learning-path-node:read')
  @ApiOperation({ summary: 'List LearningPathNodes' })
  findAll(@TenantId() tenantId: string, @Query() query: AiLearningPathNodeQueryDto) {
    return this.aiLearningPathNodeService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-learning-path-node:read')
  @ApiOperation({ summary: 'Get LearningPathNode by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiLearningPathNodeService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-learning-path-node:update')
  @ApiOperation({ summary: 'Update LearningPathNode' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiLearningPathNodeDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathNodeService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-learning-path-node:delete')
  @ApiOperation({ summary: 'Delete LearningPathNode' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiLearningPathNodeService.remove(tenantId, id, userId);
  }

}
