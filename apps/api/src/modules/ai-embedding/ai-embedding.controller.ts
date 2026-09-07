import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiEmbeddingService } from './ai-embedding.service';
import { EmbedRequestDto } from './dto/ai-embedding.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AI Embeddings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/embeddings')
export class AiEmbeddingController {
  constructor(private readonly service: AiEmbeddingService) {}

  @Post()
  @Permissions('ai:embedding:invoke')
  @ApiOperation({ summary: 'Generate text embeddings' })
  embed(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: EmbedRequestDto,
  ) {
    return this.service.embed(tenantId, userId, dto);
  }

  @Get('stats')
  @Permissions('ai:embedding:read')
  @ApiOperation({ summary: 'Embedding cache stats' })
  stats(@TenantId() tenantId: string) {
    return this.service.stats(tenantId);
  }
}
