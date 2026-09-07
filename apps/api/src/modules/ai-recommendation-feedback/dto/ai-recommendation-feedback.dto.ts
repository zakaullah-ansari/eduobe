import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiRecommendationFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recommendationId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedback?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiRecommendationFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recommendationId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedback?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;
  [key: string]: any;
}

export class AiRecommendationFeedbackQueryDto {
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
