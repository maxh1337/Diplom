import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminUserFilters {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiPropertyOptional({ example: 'Олег' })
  search: string;
}
