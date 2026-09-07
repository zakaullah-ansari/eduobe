import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiUsageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feature?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  action?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  inputTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  outputTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cost?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latencyMs?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  error?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> | any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiUsageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feature?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  action?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  inputTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  outputTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cost?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latencyMs?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  error?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> | any[];
  [key: string]: any;
}

export class AiUsageQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}
