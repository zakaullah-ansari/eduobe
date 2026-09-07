import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiMessageService } from './ai-message.service';
import { CreateAiMessageDto, UpdateAiMessageDto, AiMessageQueryDto } from './dto/ai-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiMessage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/messages')
export class AiMessageController {
  constructor(private readonly aiMessageService: AiMessageService) {}

  @Post()
  @Permissions('ai-message:create')
  @ApiOperation({ summary: 'Create AIMessage' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiMessageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiMessageService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-message:read')
  @ApiOperation({ summary: 'List AIMessages' })
  findAll(@TenantId() tenantId: string, @Query() query: AiMessageQueryDto) {
    return this.aiMessageService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-message:read')
  @ApiOperation({ summary: 'Get AIMessage by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiMessageService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-message:update')
  @ApiOperation({ summary: 'Update AIMessage' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiMessageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiMessageService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-message:delete')
  @ApiOperation({ summary: 'Delete AIMessage' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiMessageService.remove(tenantId, id, userId);
  }

}
