import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EventFilters {
  @IsString()
  @IsOptional()
  @MaxLength(10)
  title: string;

  @IsOptional()
  @IsBoolean()
  latest: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashTags: string[];
}
