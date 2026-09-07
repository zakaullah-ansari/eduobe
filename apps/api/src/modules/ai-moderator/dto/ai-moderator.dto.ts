import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModerateTextDto {
  @ApiProperty({ description: 'Text to moderate' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ enum: ['chat', 'content', 'feedback', 'question'] })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({ description: 'Strictness 0..1' })
  @IsOptional()
  @IsNumber()
  threshold?: number;

  @ApiPropertyOptional({ description: 'Allow AI gateway moderation' })
  @IsOptional()
  @IsBoolean()
  useGateway?: boolean;
}
