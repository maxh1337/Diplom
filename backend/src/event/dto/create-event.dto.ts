import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(50)
  @MinLength(10)
  @ApiProperty({ example: 'Annual Tech Meetup 2025' })
  title: string;

  @IsString()
  @MaxLength(200)
  @MinLength(20)
  @ApiProperty({
    example:
      'This is a yearly event for developers to share innovations and ideas.',
  })
  description: string;

  @Transform(({ value }) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['астрономия', 'кино', 'ночь'] })
  hashTags: string[];

  @IsString()
  @ApiProperty({ example: '2025-07-01' }) // ISO date string
  eventDate: string;

  @IsString()
  @MaxLength(12)
  @ApiProperty({ example: '19:00-21:00' })
  eventTime: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;
}
