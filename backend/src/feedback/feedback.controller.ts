import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { SendFeedbackDto } from '../event/dto/send-feeback.dto';
import { TgAuth } from '../user/decorators/tg-auth.decorator';
import { CurrentTgUser } from '../user/decorators/tg-user.decorator';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/send-feedback/:eventId')
  @UsePipes(new ValidationPipe())
  @TgAuth()
  @ApiOperation({ summary: 'Оставить отзыв на событие' })
  @ApiParam({ name: 'eventId', example: 'clv1a4l6x0000s9h9f9zv49kq' })
  @ApiBody({ type: SendFeedbackDto })
  @ApiHeader({
    name: 'x-init-data',
    description: 'Telegram Init Data',
    required: true,
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiResponse({ status: 200, description: 'Отзыв отправлен' })
  async sendFeedback(
    @Body() dto: SendFeedbackDto,
    @CurrentTgUser() telegramUser: User,
    @Param('eventId') eventId: string,
  ) {
    return this.feedbackService.sendFeedback(
      dto,
      telegramUser.id.toString(),
      eventId,
    );
  }
}
