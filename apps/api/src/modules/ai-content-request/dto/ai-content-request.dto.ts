import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiContentRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prompt?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  parameters?: Record<string, any> | any[];
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

export class UpdateAiContentRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prompt?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  parameters?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiContentRequestQueryDto {
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
