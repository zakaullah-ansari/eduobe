import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiLearningPathNodeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  learningPathId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  resources?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  estimatedHours?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  prerequisites?: Record<string, any> | any[];
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

export class UpdateAiLearningPathNodeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  learningPathId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  resources?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  estimatedHours?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  prerequisites?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiLearningPathNodeQueryDto {
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
