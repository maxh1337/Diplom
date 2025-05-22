import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ContinueRegistrationDto {
  @ApiProperty({
    example: 'Олег',
    description: 'Уникальный никнейм пользователя (до 40 символов)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nickname: string;

  @ApiProperty({
    example: 'Student',
    description:
      'Категория пользователя: SchoolBefore9, SchoolFrom9to11 или Student',
    enum: ['SchoolBefore9', 'SchoolFrom9to11', 'Student'],
  })
  @IsString()
  @IsNotEmpty()
  userCategory: 'SchoolBefore9' | 'SchoolFrom9to11' | 'Student';

  @ApiProperty({
    example: 2006,
    description: 'Год рождения пользователя',
    minimum: 1900,
    maximum: new Date().getFullYear(),
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearOfBirth: number;
}
