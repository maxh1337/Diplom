import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentAdmin } from '../auth/decorators/admin.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateEventDto } from '../event/dto/create-event.dto';
import { EventService } from '../event/event.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventService: EventService,
  ) {}

  @Post('/create-admin')
  @Auth('FULL')
  async createAdmin(@CurrentAdmin('id') creatorId: string) {
    return this.adminService.create(creatorId);
  }

  @Post('/event/create-event')
  @UsePipes(new ValidationPipe())
  @Auth()
  async createEvent(
    @CurrentAdmin('id') creatorId: string,
    @Body() dto: CreateEventDto,
  ) {
    console.log(dto);
    return this.eventService.create(creatorId, dto);
  }
}
