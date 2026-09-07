import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiChatbotConfigService } from './ai-chatbot-config.service';
import { CreateAiChatbotConfigDto, UpdateAiChatbotConfigDto, AiChatbotConfigQueryDto } from './dto/ai-chatbot-config.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiChatbotConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/chatbot-config')
export class AiChatbotConfigController {
  constructor(private readonly aiChatbotConfigService: AiChatbotConfigService) {}

  @Post()
  @Permissions('ai-chatbot-config:create')
  @ApiOperation({ summary: 'Create AIConfiguration' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiChatbotConfigDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiChatbotConfigService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-chatbot-config:read')
  @ApiOperation({ summary: 'List AIConfigurations' })
  findAll(@TenantId() tenantId: string, @Query() query: AiChatbotConfigQueryDto) {
    return this.aiChatbotConfigService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-chatbot-config:read')
  @ApiOperation({ summary: 'Get AIConfiguration by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiChatbotConfigService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-chatbot-config:update')
  @ApiOperation({ summary: 'Update AIConfiguration' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiChatbotConfigDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiChatbotConfigService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-chatbot-config:delete')
  @ApiOperation({ summary: 'Delete AIConfiguration' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiChatbotConfigService.remove(tenantId, id, userId);
  }

}
