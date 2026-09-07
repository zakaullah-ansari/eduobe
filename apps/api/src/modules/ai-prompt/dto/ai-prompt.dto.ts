import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertPromptDto {
  @ApiProperty({ example: 'chatbot.system', description: 'Prompt key' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Prompt template content' })
  @IsString()
  template: string;

  @ApiPropertyOptional({ description: 'Comma separated variables like {student_name}' })
  @IsOptional()
  @IsString()
  variables?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class PromptQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
