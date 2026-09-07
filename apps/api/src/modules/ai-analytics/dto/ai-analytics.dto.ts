import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by feature' })
  @IsOptional()
  @IsString()
  feature?: string;

  @ApiPropertyOptional({ description: 'Days to look back' })
  @IsOptional()
  @IsInt()
  days?: number = 30;
}
