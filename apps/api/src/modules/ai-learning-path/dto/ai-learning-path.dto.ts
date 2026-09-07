import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiLearningPathDto {
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
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  goal?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationWeeks?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  difficulty?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
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

export class UpdateAiLearningPathDto {
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
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  goal?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationWeeks?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  difficulty?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  [key: string]: any;
}

export class AiLearningPathQueryDto {
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
