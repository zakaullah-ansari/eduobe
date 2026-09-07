import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiContentGenerationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  requestId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  format?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  feedback?: Record<string, any> | any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiContentGenerationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  requestId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  format?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  feedback?: Record<string, any> | any[];
  [key: string]: any;
}

export class AiContentGenerationQueryDto {
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
