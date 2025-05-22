import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AdminEventFilters {
  @IsString()
  @IsOptional()
  @MaxLength(10)
  @ApiPropertyOptional({ example: 'Meetup' })
  title: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  latest: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: ['#tech', '#2025'] })
  hashTags: string[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive: boolean;
}
