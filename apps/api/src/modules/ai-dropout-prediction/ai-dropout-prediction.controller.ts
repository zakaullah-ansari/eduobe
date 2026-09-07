import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiDropoutPredictionService } from './ai-dropout-prediction.service';
import { CreateAiDropoutPredictionDto, UpdateAiDropoutPredictionDto, AiDropoutPredictionQueryDto } from './dto/ai-dropout-prediction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('AiDropoutPrediction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('ai/dropout-prediction')
export class AiDropoutPredictionController {
  constructor(private readonly aiDropoutPredictionService: AiDropoutPredictionService) {}

  @Post()
  @Permissions('ai-dropout-prediction:create')
  @ApiOperation({ summary: 'Create DropoutPrediction' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiDropoutPredictionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiDropoutPredictionService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('ai-dropout-prediction:read')
  @ApiOperation({ summary: 'List DropoutPredictions' })
  findAll(@TenantId() tenantId: string, @Query() query: AiDropoutPredictionQueryDto) {
    return this.aiDropoutPredictionService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('ai-dropout-prediction:read')
  @ApiOperation({ summary: 'Get DropoutPrediction by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.aiDropoutPredictionService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('ai-dropout-prediction:update')
  @ApiOperation({ summary: 'Update DropoutPrediction' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAiDropoutPredictionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiDropoutPredictionService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('ai-dropout-prediction:delete')
  @ApiOperation({ summary: 'Delete DropoutPrediction' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiDropoutPredictionService.remove(tenantId, id, userId);
  }

  @Post('predict')
  @Permissions('ai-dropout-prediction:predict')
  @ApiOperation({ summary: 'Predict dropout risk' })
  predict(
    @TenantId() tenantId: string,
    @Body() dto: CreateAiDropoutPredictionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiDropoutPredictionService.predict(tenantId, dto, userId);
  }

}
