import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiRecommendationDto {
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
  status?: string;
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

export class UpdateAiRecommendationDto {
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
  status?: string;
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

export class AiRecommendationQueryDto {
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
