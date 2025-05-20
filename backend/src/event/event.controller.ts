import { Controller, Get, Param, Post, Query } from '@nestjs/common';

import { User } from '@prisma/client';
import { TgAuth } from '../user/decorators/tg-auth.decorator';
import { CurrentTgUser } from '../user/decorators/tg-user.decorator';
import { EventFilters } from './dto/event.filters';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/get-all')
  // @TgAuth()
  async getAll(@Query() dto: EventFilters) {
    return this.eventService.getEvents(dto);
  }

  @Get('/get-by-id/:id')
  @TgAuth()
  async getById(@Param('id') eventId: string) {
    return this.eventService.getById(eventId);
  }

  @Post('/toggle-participation/:eventId')
  @TgAuth()
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
