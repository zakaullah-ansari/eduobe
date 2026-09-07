import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmbedRequestDto {
  @ApiProperty({ description: 'Text to embed', type: [String] })
  @IsArray()
  @IsString({ each: true })
  texts: string[];

  @ApiPropertyOptional({ description: 'Cache key namespace' })
  @IsOptional()
  @IsString()
  namespace?: string;

  @ApiPropertyOptional({ example: 'text-embedding-3-small' })
  @IsOptional()
  @IsString()
  model?: string;
}

export class EmbeddingCacheQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  namespace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number = 50;
}
