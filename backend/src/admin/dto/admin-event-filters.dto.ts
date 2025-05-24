import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  })
  @ApiPropertyOptional({ example: ['#tech', '#2025'] })
  hashTags: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @ApiPropertyOptional({ example: true })
  isActive: boolean;
}
