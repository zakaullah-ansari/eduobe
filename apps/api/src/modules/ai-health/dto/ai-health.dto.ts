import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class HealthQueryDto {
  @ApiPropertyOptional({ description: 'Include per-feature counts' })
  @IsOptional()
  @IsString()
  scope?: string;
}
