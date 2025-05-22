import { ApiPropertyOptional } from '@nestjs/swagger';
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
  latest: boolean;

  @ApiPropertyOptional({
    example: ['Tech', 'Startup'],
    description: 'Хэштеги для фильтрации событий',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashTags: string[];
}
