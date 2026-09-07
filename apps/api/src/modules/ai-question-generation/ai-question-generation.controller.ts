import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiQuestionGenerationService } from './ai-question-generation.service';
import { CreateAiQuestionGenerationDto, UpdateAiQuestionGenerationDto, AiQuestionGenerationQueryDto } from './dto/ai-question-generation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiQuestionGeneration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/question-generation')
export class AiQuestionGenerationController {
  constructor(private readonly aiQuestionGenerationService: AiQuestionGenerationService) {}

  @Post()
  @Permissions('ai-question-generation:create')
  @ApiOperation({ summary: 'Create AIQuestion' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiQuestionGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiQuestionGenerationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-question-generation:read')
  @ApiOperation({ summary: 'List AIQuestions' })
  findAll(@TenantId() tenantId: string, @Query() query: AiQuestionGenerationQueryDto) {
    return this.aiQuestionGenerationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-question-generation:read')
  @ApiOperation({ summary: 'Get AIQuestion by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiQuestionGenerationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-question-generation:update')
  @ApiOperation({ summary: 'Update AIQuestion' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiQuestionGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiQuestionGenerationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-question-generation:delete')
  @ApiOperation({ summary: 'Delete AIQuestion' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiQuestionGenerationService.remove(tenantId, id, userId);
  }

  @Post('generate')
  @Permissions('ai-question-generation:generate')
  @ApiOperation({ summary: 'Generate AI questions' })
  generate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiQuestionGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiQuestionGenerationService.generate(tenantId, dto, userId);
  }

}
