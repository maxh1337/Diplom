import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'admin',
    description: 'Логин администратора',
  })
  @IsString({ message: 'Login must be a string' })
  @IsNotEmpty({ message: 'Login cannot be empty' })
  login: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Пароль администратора',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
