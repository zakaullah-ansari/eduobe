import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import {
  StartConversationDto,
  ChatDto,
  ChatFeedbackDto,
  ConversationQueryDto,
} from './dto/ai-chatbot.dto';

@Injectable()
export class AiChatbotService {
  private readonly logger = new Logger(AiChatbotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly gateway: AiGatewayService,
  ) {}

  async start(tenantId: string, userId: string, dto: StartConversationDto) {
    const conversation = await this.prisma.aIConversation.create({
      data: {
        tenantId,
        userId,
        topic: dto.topic ?? 'general',
        context: dto.context,
      },
    });

    this.events.emit(DomainEvent.AI_CONVERSATION_STARTED, {
      conversation,
      tenantId,
      userId,
    });

    return conversation;
  }

  async chat(tenantId: string, userId: string, dto: ChatDto) {
    const conversation = dto.conversationId
      ? await this.prisma.aIConversation.findFirst({
          where: { id: dto.conversationId, tenantId },
        })
      : await this.start(tenantId, userId, { topic: 'general' });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Persist user message
    const userMessage = await this.prisma.aIMessage.create({
      data: {
        tenantId,
        conversationId: conversation.id,
        role: 'user',
        content: dto.message,
      },
    });

    // Call the Python AI microservice
    let gatewayResult: Record<string, any>;
    try {
      gatewayResult = await this.gateway.invoke('chatbot', {
        tenantId,
        userId,
        conversationId: conversation.id,
        message: dto.message,
        context: {
          ...((conversation.context as Record<string, any>) ?? {}),
          ...(dto.context ?? {}),
        },
        history: await this.buildHistory(tenantId, conversation.id),
      });
    } catch (error: any) {
      await this.prisma.aIUsageLog.create({
        data: {
          tenantId,
          userId,
          feature: 'chatbot',
          action: 'chat',
          status: 'failed',
          error: error.message,
          metadata: { conversationId: conversation.id },
        },
      });
      throw error;
    }

    const answer = gatewayResult.answer ?? gatewayResult.result?.answer ?? 'No response';
    const assistantMessage = await this.prisma.aIMessage.create({
      data: {
        tenantId,
        conversationId: conversation.id,
        role: 'assistant',
        content: String(answer),
        tokens: gatewayResult.usage?.outputTokens ?? gatewayResult.tokens ?? undefined,
        latencyMs: gatewayResult.latencyMs,
        metadata: gatewayResult.metadata,
      },
    });

    await this.prisma.aIConversation.update({
      where: { id: conversation.id },
      data: {
        messageCount: { increment: 2 },
        lastMessageAt: new Date(),
      },
    });

    await this.prisma.aIUsageLog.create({
      data: {
        tenantId,
        userId,
        feature: 'chatbot',
        model: gatewayResult.model ?? 'gpt-4o-mini',
        action: 'chat',
        inputTokens: gatewayResult.usage?.inputTokens ?? 0,
        outputTokens: gatewayResult.usage?.outputTokens ?? 0,
        latencyMs: gatewayResult.latencyMs,
        status: 'success',
        metadata: { conversationId: conversation.id },
      },
    });

    this.events.emit(DomainEvent.AI_MESSAGE_SENT, {
      conversationId: conversation.id,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
      tenantId,
      userId,
    });

    return {
      conversation,
      messages: [userMessage, assistantMessage],
      suggestedPrompts: gatewayResult.suggestedPrompts ?? [],
    };
  }

  async listConversations(tenantId: string, userId: string, query: ConversationQueryDto) {
    const where: any = { tenantId, userId };
    if (query.topic) where.topic = query.topic;
    if (query.status) where.status = query.status;

    return this.prisma.aIConversation.findMany({
      where,
      orderBy: { lastMessageAt: 'desc' },
      skip: ((query.page ?? 1) - 1) * (query.limit ?? 20),
      take: query.limit ?? 20,
      include: { _count: { select: { messages: true } } },
    });
  }

  async getMessages(tenantId: string, conversationId: string) {
    const conversation = await this.prisma.aIConversation.findFirst({
      where: { id: conversationId, tenantId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.aIMessage.findMany({
      where: { conversationId, tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async feedback(tenantId: string, userId: string, dto: ChatFeedbackDto) {
    const message = await this.prisma.aIMessage.findFirst({
      where: { id: dto.messageId, tenantId },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const feedback = await this.prisma.aIFeedback.create({
      data: {
        tenantId,
        userId,
        feedbackType: (dto.feedbackType ?? 'other') as any,
        targetType: 'chat_message',
        targetId: dto.messageId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    await this.prisma.aIMessage.update({
      where: { id: dto.messageId },
      data: { feedbackId: feedback.id },
    });

    this.events.emit(DomainEvent.AI_FEEDBACK_RECEIVED, { feedback, tenantId, userId });
    return feedback;
  }

  private async buildHistory(tenantId: string, conversationId: string) {
    const messages = await this.prisma.aIMessage.findMany({
      where: { conversationId, tenantId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    return messages.map((m) => ({ role: m.role, content: m.content }));
  }
}
