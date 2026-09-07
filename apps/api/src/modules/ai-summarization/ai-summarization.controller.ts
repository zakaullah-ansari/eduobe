import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiSummarizationService } from './ai-summarization.service';
import { CreateAiSummarizationDto, UpdateAiSummarizationDto, AiSummarizationQueryDto } from './dto/ai-summarization.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiSummarization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/summarization')
export class AiSummarizationController {
  constructor(private readonly aiSummarizationService: AiSummarizationService) {}

  @Post()
  @Permissions('ai-summarization:create')
  @ApiOperation({ summary: 'Create GeneratedContent' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSummarizationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSummarizationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-summarization:read')
  @ApiOperation({ summary: 'List GeneratedContents' })
  findAll(@TenantId() tenantId: string, @Query() query: AiSummarizationQueryDto) {
    return this.aiSummarizationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-summarization:read')
  @ApiOperation({ summary: 'Get GeneratedContent by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiSummarizationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-summarization:update')
  @ApiOperation({ summary: 'Update GeneratedContent' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiSummarizationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSummarizationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-summarization:delete')
  @ApiOperation({ summary: 'Delete GeneratedContent' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSummarizationService.remove(tenantId, id, userId);
  }

  @Post('summarize')
  @Permissions('ai-summarization:summarize')
  @ApiOperation({ summary: 'Summarize document or text' })
  summarize(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiSummarizationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiSummarizationService.summarize(tenantId, dto, userId);
  }

}
