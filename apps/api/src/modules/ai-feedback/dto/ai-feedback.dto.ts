import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedbackType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
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

export class UpdateAiFeedbackDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedbackType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetType?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> | any[];
  [key: string]: any;
}

export class AiFeedbackQueryDto {
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
