import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiPromptService } from './ai-prompt.service';
import { UpsertPromptDto, PromptQueryDto } from './dto/ai-prompt.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Prompts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/prompts')
export class AiPromptController {
  constructor(private readonly service: AiPromptService) {}

  @Get()
  @Permissions('ai:prompts:read')
  @ApiOperation({ summary: 'List AI prompt templates' })
  list(@TenantId() tenantId: string, @Query() query: PromptQueryDto) {
    return this.service.list(tenantId, query);
  }

  @Post()
  @Permissions('ai:prompts:write')
  @ApiOperation({ summary: 'Create or update an AI prompt template' })
  upsert(@TenantId() tenantId: string, @Body() dto: UpsertPromptDto) {
    return this.service.upsert(tenantId, dto);
  }

  @Delete(':key')
  @Permissions('ai:prompts:delete')
  @ApiOperation({ summary: 'Delete an AI prompt template' })
  remove(@TenantId() tenantId: string, @Param('key') key: string) {
    return this.service.remove(tenantId, key);
  }
}
