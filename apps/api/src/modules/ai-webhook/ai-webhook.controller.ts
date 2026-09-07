import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiWebhookService } from './ai-webhook.service';
import { AiWebhookEventDto } from './dto/ai-webhook.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('AI Webhook')
@Controller('ai/webhook')
export class AiWebhookController {
  constructor(private readonly service: AiWebhookService) {}

  @Post()
  @ApiOperation({ summary: 'AI microservice async job callback' })
  handle(
    @Headers('x-ai-service-key') apiKey: string,
    @Body() dto: AiWebhookEventDto,
  ) {
    this.service.verifyKey(apiKey);
    return this.service.handle(dto);
  }

  @Post('demo')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Permissions('ai:webhook:invoke')
  @ApiOperation({ summary: 'Simulate an AI webhook event (admin)' })
  simulate(@Body() dto: AiWebhookEventDto) {
    return this.service.handle(dto);
  }
}
