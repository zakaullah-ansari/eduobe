import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiPropertyOptional({ description: 'Conversation topic' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Context payload for grounding' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class ChatDto {
  @ApiPropertyOptional({ description: 'Existing conversation ID' })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiProperty({ description: 'User message' })
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class ChatFeedbackDto {
  @ApiProperty({ description: 'AIMessage ID being rated' })
  @IsString()
  messageId: string;

  @ApiPropertyOptional({ enum: ['helpful', 'not_helpful', 'inaccurate', 'inappropriate', 'other'] })
  @IsOptional()
  @IsString()
  feedbackType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ConversationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number = 20;
}

export class ConversationMessageQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number = 100;
}
