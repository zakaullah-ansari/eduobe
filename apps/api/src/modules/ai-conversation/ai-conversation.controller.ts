import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiConversationService } from './ai-conversation.service';
import { CreateAiConversationDto, UpdateAiConversationDto, AiConversationQueryDto } from './dto/ai-conversation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiConversation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/conversations')
export class AiConversationController {
  constructor(private readonly aiConversationService: AiConversationService) {}

  @Post()
  @Permissions('ai-conversation:create')
  @ApiOperation({ summary: 'Create AIConversation' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiConversationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiConversationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-conversation:read')
  @ApiOperation({ summary: 'List AIConversations' })
  findAll(@TenantId() tenantId: string, @Query() query: AiConversationQueryDto) {
    return this.aiConversationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-conversation:read')
  @ApiOperation({ summary: 'Get AIConversation by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiConversationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-conversation:update')
  @ApiOperation({ summary: 'Update AIConversation' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiConversationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiConversationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-conversation:delete')
  @ApiOperation({ summary: 'Delete AIConversation' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiConversationService.remove(tenantId, id, userId);
  }

}
