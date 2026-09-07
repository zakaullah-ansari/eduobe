import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiSentimentService } from './ai-sentiment.service';
import { CreateAiSentimentDto, UpdateAiSentimentDto, AiSentimentQueryDto } from './dto/ai-sentiment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiSentiment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/sentiment')
export class AiSentimentController {
  constructor(private readonly aiSentimentService: AiSentimentService) {}

  @Post()
  @Permissions('ai-sentiment:create')
  @ApiOperation({ summary: 'Create SentimentAnalysis' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSentimentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSentimentService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-sentiment:read')
  @ApiOperation({ summary: 'List SentimentAnalysiss' })
  findAll(@TenantId() tenantId: string, @Query() query: AiSentimentQueryDto) {
    return this.aiSentimentService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-sentiment:read')
  @ApiOperation({ summary: 'Get SentimentAnalysis by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiSentimentService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-sentiment:update')
  @ApiOperation({ summary: 'Update SentimentAnalysis' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiSentimentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSentimentService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-sentiment:delete')
  @ApiOperation({ summary: 'Delete SentimentAnalysis' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSentimentService.remove(tenantId, id, userId);
  }

  @Post('analyze')
  @Permissions('ai-sentiment:analyze')
  @ApiOperation({ summary: 'Analyze text sentiment' })
  analyze(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSentimentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSentimentService.analyze(tenantId, dto, userId);
  }

}
