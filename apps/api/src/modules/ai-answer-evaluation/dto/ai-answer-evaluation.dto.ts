import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiAnswerEvaluationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  aiQuestionId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentAnswer?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  expectedAnswer?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  rubric?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxScore?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedback?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  highlights?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiAnswerEvaluationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  aiQuestionId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentAnswer?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  expectedAnswer?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  rubric?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxScore?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  feedback?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  highlights?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  [key: string]: any;
}

export class AiAnswerEvaluationQueryDto {
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
