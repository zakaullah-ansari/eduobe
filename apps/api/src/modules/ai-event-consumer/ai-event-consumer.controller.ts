import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiEventConsumerService } from './ai-event-consumer.service';
import { ReplayEventDto } from './dto/ai-event-consumer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Event Consumer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/events')
export class AiEventConsumerController {
  constructor(private readonly service: AiEventConsumerService) {}

  @Get()
  @Permissions('ai:events:read')
  @ApiOperation({ summary: 'AI event consumer status' })
  status() {
    return this.service.status();
  }

  @Post('enqueue')
  @Permissions('ai:events:invoke')
  @ApiOperation({ summary: 'Manually enqueue an AI job' })
  enqueue(@TenantId() tenantId: string, @Body() dto: ReplayEventDto) {
    return this.service.enqueue('content_batch', { ...dto, tenantId }, tenantId);
  }
}
