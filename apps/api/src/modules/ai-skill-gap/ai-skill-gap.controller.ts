import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiSkillGapService } from './ai-skill-gap.service';
import { CreateAiSkillGapDto, UpdateAiSkillGapDto, AiSkillGapQueryDto } from './dto/ai-skill-gap.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiSkillGap')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/skill-gaps')
export class AiSkillGapController {
  constructor(private readonly aiSkillGapService: AiSkillGapService) {}

  @Post()
  @Permissions('ai-skill-gap:create')
  @ApiOperation({ summary: 'Create SkillGapAnalysis' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSkillGapDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSkillGapService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-skill-gap:read')
  @ApiOperation({ summary: 'List SkillGapAnalysiss' })
  findAll(@TenantId() tenantId: string, @Query() query: AiSkillGapQueryDto) {
    return this.aiSkillGapService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-skill-gap:read')
  @ApiOperation({ summary: 'Get SkillGapAnalysis by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiSkillGapService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-skill-gap:update')
  @ApiOperation({ summary: 'Update SkillGapAnalysis' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiSkillGapDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSkillGapService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-skill-gap:delete')
  @ApiOperation({ summary: 'Delete SkillGapAnalysis' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSkillGapService.remove(tenantId, id, userId);
  }

  @Post('analyze')
  @Permissions('ai-skill-gap:analyze')
  @ApiOperation({ summary: 'Analyze skill gaps' })
  analyze(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSkillGapDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSkillGapService.analyze(tenantId, dto, userId);
  }

}
