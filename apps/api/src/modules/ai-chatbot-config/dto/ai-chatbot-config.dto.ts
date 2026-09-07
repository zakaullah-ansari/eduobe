import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiChatbotConfigDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  chatbotEnabled?: boolean;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chatbotName?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chatbotWelcome?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  temperature?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  dataRetentionDays?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  guardrails?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  prompts?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fallbackMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  [key: string]: any;
}

export class UpdateAiChatbotConfigDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  chatbotEnabled?: boolean;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chatbotName?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chatbotWelcome?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  temperature?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxTokens?: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  dataRetentionDays?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  guardrails?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  prompts?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fallbackMessage?: string;
  [key: string]: any;
}

export class AiChatbotConfigQueryDto {
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
