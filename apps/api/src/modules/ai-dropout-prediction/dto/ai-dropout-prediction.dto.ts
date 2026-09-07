import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiDropoutPredictionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseOfferingId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  riskScore?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  riskLevel?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  factors?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  intervention?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelVersion?: string;
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

export class UpdateAiDropoutPredictionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  studentId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  courseOfferingId?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  riskScore?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  riskLevel?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  factors?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  intervention?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelVersion?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiDropoutPredictionQueryDto {
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
