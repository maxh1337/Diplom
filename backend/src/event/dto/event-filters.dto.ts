import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EventFilters {
  @ApiPropertyOptional({
    example: 'Hack',
    description: 'Поиск по названию события (макс 10 символов)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  title: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Показать только последние события',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  latest: boolean;

  @ApiPropertyOptional({
    example: ['Tech', 'Startup'],
    description: 'Хэштеги для фильтрации событий',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  })
  @IsString({ each: true })
  hashTags: string[];
}
