import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService, DomainEvent } from '../event/event.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { CreateAiConversationDto, UpdateAiConversationDto, AiConversationQueryDto } from './dto/ai-conversation.dto';

@Injectable()
export class AiConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventService,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async create(tenantId: string, dto: CreateAiConversationDto, userId: string) {
    const record = await this.prisma.aIConversation.create({
      data: {
        ...(dto as any),
        tenantId,
      },
    });

    this.events.emit(DomainEvent.AI_RECORD_CREATED, { entity: 'AIConversation', record, tenantId, userId });
    return record;
  }

  async findAll(tenantId: string, query: AiConversationQueryDto) {
    const where: any = { tenantId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.aIConversation.findMany({
        where,
        orderBy: { createdAt: 'desc' } as any,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
      this.prisma.aIConversation.count({ where }),
    ]);

    return {
      items,
      meta: {
        page: query.page || 1,
        limit: query.limit || 20,
        total,
        totalPages: Math.ceil(total / (query.limit || 20)),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const record = await this.prisma.aIConversation.findFirst({ where: { id, tenantId } });

    if (!record) {
      throw new NotFoundException('AIConversation not found');
    }

    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAiConversationDto, userId: string) {
    await this.findOne(tenantId, id);

    const record = await this.prisma.aIConversation.update({
      where: { id },
      data: dto as any,
    });

    this.events.emit(DomainEvent.AI_RECORD_UPDATED, { entity: 'AIConversation', record, tenantId, userId });
    return record;
  }

  async remove(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id);

    try {
      await this.prisma.aIConversation.update({ where: { id }, data: { status: 'archived' } as any });
    } catch {
      await this.prisma.aIConversation.delete({ where: { id } });
    }

    this.events.emit(DomainEvent.AI_RECORD_DELETED, { entity: 'AIConversation', id, tenantId, userId });
    return { message: 'Deleted successfully' };
  }

}
