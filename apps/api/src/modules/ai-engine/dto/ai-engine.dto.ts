import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AiEngineProbeDto {
  @ApiProperty({ example: 'chatbot', description: 'AI feature to invoke' })
  @IsString()
  feature: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
