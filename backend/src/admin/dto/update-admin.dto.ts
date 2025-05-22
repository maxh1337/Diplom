import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAdminFieldsDto {
  @IsString()
  @ApiProperty({ example: 'Andrey Perkov' })
  username: string;
}
