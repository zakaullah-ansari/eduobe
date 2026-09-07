import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class InsightsQueryDto {
  @ApiPropertyOptional({ description: 'Course offering ID to scope insights' })
  @IsOptional()
  @IsString()
  courseOfferingId?: string;

  @ApiPropertyOptional({ description: 'Days to look back' })
  @IsOptional()
  @IsInt()
  days?: number = 30;
}

export class SentimentSummaryDto {
  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Precomputed sentiment rows' })
  @IsOptional()
  @IsObject()
  sentiments?: Record<string, any>[];
}
