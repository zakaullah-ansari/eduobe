import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiSearchFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  queryId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  resultId?: string;
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  relevant?: boolean;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiSearchFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  queryId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  resultId?: string;
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  relevant?: boolean;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
  [key: string]: any;
}

export class AiSearchFeedbackQueryDto {
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
