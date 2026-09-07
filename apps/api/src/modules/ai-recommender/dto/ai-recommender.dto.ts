import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiRecommenderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  recommendedCourseIds?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiRecommenderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  recommendedCourseIds?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;
  [key: string]: any;
}

export class AiRecommenderQueryDto {
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
