import { IsOptional, IsString } from 'class-validator';

export class AdminSearchFiltersDto {
  @IsString()
  @IsOptional()
  search?: string;
}
