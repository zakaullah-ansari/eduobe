import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiFeedbackService } from './ai-feedback.service';
import { CreateAiFeedbackDto, UpdateAiFeedbackDto, AiFeedbackQueryDto } from './dto/ai-feedback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiFeedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/feedback')
export class AiFeedbackController {
  constructor(private readonly aiFeedbackService: AiFeedbackService) {}

  @Post()
  @Permissions('ai-feedback:create')
  @ApiOperation({ summary: 'Create AIFeedback' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiFeedbackService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-feedback:read')
  @ApiOperation({ summary: 'List AIFeedbacks' })
  findAll(@TenantId() tenantId: string, @Query() query: AiFeedbackQueryDto) {
    return this.aiFeedbackService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-feedback:read')
  @ApiOperation({ summary: 'Get AIFeedback by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiFeedbackService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-feedback:update')
  @ApiOperation({ summary: 'Update AIFeedback' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiFeedbackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiFeedbackService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-feedback:delete')
  @ApiOperation({ summary: 'Delete AIFeedback' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiFeedbackService.remove(tenantId, id, userId);
  }

}
