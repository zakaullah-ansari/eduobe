import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AiWebhookEventDto {
  @ApiProperty({ example: 'dropout_batch', description: 'AI job type' })
  @IsString()
  jobType: string;

  @ApiPropertyOptional({ description: 'AI job id from the microservice' })
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional({ enum: ['queued', 'running', 'completed', 'failed', 'cancelled'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  result?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  error?: string;
}
