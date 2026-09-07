import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CacheFlushDto {
  @ApiPropertyOptional({ description: 'Only flush keys for this tenant namespace' })
  @IsOptional()
  @IsString()
  namespace?: string;

  @ApiPropertyOptional({ description: 'Flush only keys matching pattern (Redis glob)' })
  @IsOptional()
  @IsString()
  pattern?: string;
}
