import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ContinueRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  userCategory: 'SchoolBefore9' | 'SchoolFrom9to11' | 'Student';

  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearOfBirth: number;
}
