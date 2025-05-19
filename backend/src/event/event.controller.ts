import { Controller, Get, Query } from '@nestjs/common';
import { EventFilters } from './dto/event.filters';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/get-all')
  async getAll(
    @Query() dto: EventFilters,
    // @TelegramUser() user: ITelegramUser,
  ) {
    return this.eventService.getEvents(dto);
  }
}
