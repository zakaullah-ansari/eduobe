import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiMessageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  conversationId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tokens?: number;
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

export class UpdateAiMessageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  conversationId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tokens?: number;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> | any[];
  [key: string]: any;
}

export class AiMessageQueryDto {
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
