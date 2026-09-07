import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAiConversationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  topic?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  context?: Record<string, any> | any[];
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

export class UpdateAiConversationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  topic?: string;
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  context?: Record<string, any> | any[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
  [key: string]: any;
}

export class AiConversationQueryDto {
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
