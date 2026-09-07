import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiContentGenerationService } from './ai-content-generation.service';
import { CreateAiContentGenerationDto, UpdateAiContentGenerationDto, AiContentGenerationQueryDto } from './dto/ai-content-generation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiContentGeneration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/content-generation')
export class AiContentGenerationController {
  constructor(private readonly aiContentGenerationService: AiContentGenerationService) {}

  @Post()
  @Permissions('ai-content-generation:create')
  @ApiOperation({ summary: 'Create GeneratedContent' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiContentGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentGenerationService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-content-generation:read')
  @ApiOperation({ summary: 'List GeneratedContents' })
  findAll(@TenantId() tenantId: string, @Query() query: AiContentGenerationQueryDto) {
    return this.aiContentGenerationService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-content-generation:read')
  @ApiOperation({ summary: 'Get GeneratedContent by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiContentGenerationService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-content-generation:update')
  @ApiOperation({ summary: 'Update GeneratedContent' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiContentGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentGenerationService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-content-generation:delete')
  @ApiOperation({ summary: 'Delete GeneratedContent' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentGenerationService.remove(tenantId, id, userId);
  }

  @Post('generate')
  @Permissions('ai-content-generation:generate')
  @ApiOperation({ summary: 'Generate AI content' })
  generate(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiContentGenerationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiContentGenerationService.generate(tenantId, dto, userId);
  }

}
