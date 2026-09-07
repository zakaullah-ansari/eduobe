import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReplayEventDto {
  @ApiPropertyOptional({ description: 'Domain event name to replay' })
  @IsOptional()
  @IsString()
  event?: string;

  @ApiPropertyOptional({ description: 'Only resolve for this tenant' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'Include AI microservice call' })
  @IsOptional()
  @IsBoolean()
  invokeAi?: boolean;
}

export class EventStatusQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  event?: string;
}
