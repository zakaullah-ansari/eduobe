import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiSkillGapDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  detectedSkills?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  missingSkills?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  suggestions?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
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

export class UpdateAiSkillGapDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  detectedSkills?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  missingSkills?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  suggestions?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  score?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiSkillGapQueryDto {
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
