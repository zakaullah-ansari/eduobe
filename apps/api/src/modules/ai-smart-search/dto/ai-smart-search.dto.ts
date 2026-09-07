import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiSmartSearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  filters?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  results?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  resultCount?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  engine?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiSmartSearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  filters?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  results?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  resultCount?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  engine?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiSmartSearchQueryDto {
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
