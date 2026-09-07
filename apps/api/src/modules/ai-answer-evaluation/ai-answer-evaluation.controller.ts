import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiAnswerEvaluationService } from './ai-answer-evaluation.service';
import { CreateAiAnswerEvaluationDto, UpdateAiAnswerEvaluationDto, AiAnswerEvaluationQueryDto } from './dto/ai-answer-evaluation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiAnswerEvaluation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/answer-evaluation')
export class AiAnswerEvaluationController {
  constructor(private readonly aiAnswerEvaluationService: AiAnswerEvaluationService) {}

  @Post()
  @Permissions('ai-answer-evaluation:create')
  @ApiOperation({ summary: 'Create AnswerEvaluation' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiAnswerEvaluationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAnswerEvaluationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-answer-evaluation:read')
  @ApiOperation({ summary: 'List AnswerEvaluations' })
  findAll(@TenantId() tenantId: string, @Query() query: AiAnswerEvaluationQueryDto) {
    return this.aiAnswerEvaluationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-answer-evaluation:read')
  @ApiOperation({ summary: 'Get AnswerEvaluation by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiAnswerEvaluationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-answer-evaluation:update')
  @ApiOperation({ summary: 'Update AnswerEvaluation' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiAnswerEvaluationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAnswerEvaluationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-answer-evaluation:delete')
  @ApiOperation({ summary: 'Delete AnswerEvaluation' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAnswerEvaluationService.remove(tenantId, id, userId);
  }

  @Post('evaluate')
  @Permissions('ai-answer-evaluation:evaluate')
  @ApiOperation({ summary: 'Evaluate student answer' })
  evaluate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiAnswerEvaluationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAnswerEvaluationService.evaluate(tenantId, dto, userId);
  }

}
