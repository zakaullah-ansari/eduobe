import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiQuestionGenerationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  difficulty?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  topic?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  options?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  correctAnswer?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  explanation?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bloomLevel?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  marks?: number;
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

export class UpdateAiQuestionGenerationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  difficulty?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  topic?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  options?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  correctAnswer?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  explanation?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bloomLevel?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  marks?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  [key: string]: any;
}

export class AiQuestionGenerationQueryDto {
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
