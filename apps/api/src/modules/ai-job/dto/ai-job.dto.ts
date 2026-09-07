import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiJobDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobType?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  payload?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  progress?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  attempts?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  result?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  error?: string;

  [key: string]: any;
}

export class UpdateAiJobDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobType?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  payload?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  progress?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  attempts?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  result?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  error?: string;
  [key: string]: any;
}

export class AiJobQueryDto {
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
