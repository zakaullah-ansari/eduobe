import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiAtRiskDto {
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
  reasons?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  attendancePercent?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  marksAverage?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  interventionPlan?: Record<string, any> | any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiAtRiskDto {
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
  reasons?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  attendancePercent?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  marksAverage?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  interventionPlan?: Record<string, any> | any[];
  [key: string]: any;
}

export class AiAtRiskQueryDto {
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
