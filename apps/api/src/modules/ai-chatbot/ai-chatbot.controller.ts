import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiChatbotService } from './ai-chatbot.service';
import {
  StartConversationDto,
  ChatDto,
  ChatFeedbackDto,
  ConversationQueryDto,
} from './dto/ai-chatbot.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Chatbot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/chatbot')
export class AiChatbotController {
  constructor(private readonly service: AiChatbotService) {}

  @Post('start')
  @Permissions('ai:chatbot:chat')
  @ApiOperation({ summary: 'Start a new chatbot conversation' })
  start(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: StartConversationDto,
  ) {
    return this.service.start(tenantId, userId, dto);
  }

  @Post('chat')
  @Permissions('ai:chatbot:chat')
  @ApiOperation({ summary: 'Send a message to the AI chatbot' })
  chat(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ChatDto,
  ) {
    return this.service.chat(tenantId, userId, dto);
  }

  @Get('conversations')
  @Permissions('ai:chatbot:read')
  @ApiOperation({ summary: 'List conversations' })
  list(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Query() query: ConversationQueryDto,
  ) {
    return this.service.listConversations(tenantId, userId, query);
  }

  @Get('conversations/:id/messages')
  @Permissions('ai:chatbot:read')
  @ApiOperation({ summary: 'Get conversation messages' })
  messages(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.service.getMessages(tenantId, id);
  }

  @Post('feedback')
  @Permissions('ai:chatbot:feedback')
  @ApiOperation({ summary: 'Submit feedback for a chatbot response' })
  feedback(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ChatFeedbackDto,
  ) {
    return this.service.feedback(tenantId, userId, dto);
  }
}
