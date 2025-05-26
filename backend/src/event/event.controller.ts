import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { TgAuth } from '../user/decorators/tg-auth.decorator';
import { CurrentTgUser } from '../user/decorators/tg-user.decorator';
import { EventFilters } from './dto/event-filters.dto';
import { EventService } from './event.service';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/get-all')
  @TgAuth()
  @ApiOperation({ summary: 'Получить список всех событий с фильтрацией' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'latest', required: false, type: Boolean })
  @ApiQuery({ name: 'hashTags', required: false, type: [String] })
  @ApiHeader({
    name: 'x-init-data',
    description: 'Telegram Init Data (проверяется ботом)',
    required: true,
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'Список событий успешно получен' })
  async getAll(@Query() dto: EventFilters) {
    return this.eventService.getEvents(dto);
  }

  @Get('/get-by-id/:id')
  @TgAuth()
  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID события',
    example: 'clv1a4l6x0000s9h9f9zv49kq',
  })
  @ApiHeader({
    name: 'x-init-data',
    description: 'Telegram Init Data',
    required: true,
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiResponse({ status: 200, description: 'Информация о событии' })
  async getById(@Param('id') eventId: string) {
    return this.eventService.getById(eventId);
  }

  @Post('/toggle-participation/:eventId')
  @TgAuth()
  @ApiOperation({ summary: 'Войти/выйти из участия в событии' })
  @ApiParam({ name: 'eventId', example: 'clv1a4l6x0000s9h9f9zv49kq' })
  @ApiHeader({
    name: 'x-init-data',
    description: 'Telegram Init Data',
    required: true,
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiResponse({ status: 200, description: 'Статус участия изменён' })
  async iWillGoOnEvent(
    @Param('eventId') eventId: string,
    @CurrentTgUser() telegramUser: User,
  ) {
    return this.eventService.iWillGoOnEvent(
      telegramUser.id.toString(),
      eventId,
    );
  }
}
