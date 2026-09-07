import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiStudyPlanDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  programId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weekRange?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  schedule?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  tasks?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  generatedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiStudyPlanDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  programId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weekRange?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  schedule?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  tasks?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  generatedBy?: string;
  [key: string]: any;
}

export class AiStudyPlanQueryDto {
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
