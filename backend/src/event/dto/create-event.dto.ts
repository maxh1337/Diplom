import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(50)
  @MinLength(10)
  title: string;

  @IsString()
  @MaxLength(150)
  @MinLength(20)
  description: string;

  @IsArray()
  @IsString({ each: true })
  hashTags: string[];

  @IsString()
  eventDate: Date;

  // 19:00-21:00
  @IsString()
  @MaxLength(12)
  eventTime: string;
}
