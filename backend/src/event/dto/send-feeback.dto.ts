import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SendFeedbackDto {
  @ApiProperty({ example: 5, description: 'Оценка события от 1 до 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Супер событие!',
    description: 'Комментарий к событию',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
