import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiSentimentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseOfferingId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sourceId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sentiment?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidence?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  keywords?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiSentimentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseOfferingId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sourceId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sentiment?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidence?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  keywords?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  summary?: string;
  [key: string]: any;
}

export class AiSentimentQueryDto {
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
