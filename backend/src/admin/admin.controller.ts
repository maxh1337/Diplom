import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentAdmin } from '../auth/decorators/admin.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateEventDto } from '../event/dto/create-event.dto';
import { EventService } from '../event/event.service';
import { FeedbackService } from '../feedback/feedback.service';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';
import { AdminEventFilters } from './dto/admin-event-filters.dto';
import { AdminUserFilters } from './dto/admin-user-filters.dto';
import { UpdateAdminFieldsDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@Controller('admin')
@ApiCookieAuth()
export class AdminController {
  constructor(
    private readonly eventService: EventService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @ApiOperation({ summary: 'Получить профиль администратора' })
  @ApiResponse({ status: 200, description: 'Профиль администратора получен' })
  @Auth()
  @Get('/get-profile/')
  async getAdminProfile(@CurrentAdmin('id') adminId: string) {
    return await this.adminService.getAdminProfile(adminId);
  }

  @ApiOperation({ summary: 'Создать нового админа (только FULL права)' })
  @ApiResponse({ status: 201, description: 'Новый админ создан' })
  @Auth('FULL')
  @Post('/create-admin')
  @HttpCode(201)
  async createNewAdmin(@CurrentAdmin('id') creatorId: string) {
    return await this.adminService.createNewAdmin(creatorId);
  }

  @ApiOperation({ summary: 'Обновить профиль админа' })
  @ApiBody({
    type: UpdateAdminFieldsDto,
    examples: {
      example1: {
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Профиль обновлён' })
  @Patch('update-profile')
  @Auth()
  @HttpCode(200)
  async updateAdminProfile(
    @CurrentAdmin('id') adminId: string,
    @Body() dto: UpdateAdminFieldsDto,
  ) {
    return await this.adminService.updateAdminProfile(adminId, dto);
  }

  @Post('/event/create')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Создать событие' })
  @ApiBody({
    type: CreateEventDto,
    examples: {
      default: {
        value: {
          title: 'Tech Meetup 2025',
          description: 'Annual tech conference',
          date: '2025-06-15T10:00:00Z',
          location: 'Moscow',
          isActive: true,
          hashTags: ['#tech', '#conference'],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Событие создано' })
  async createEvent(
    @CurrentAdmin('id') adminId: string,
    @Body() dto: CreateEventDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log(image);
    return this.eventService.create(adminId, dto, image);
  }

  @ApiOperation({ summary: 'Получить все события (фильтры опциональны)' })
  @ApiQuery({ name: 'title', required: false, example: 'Tech Meetup 2025' })
  @ApiQuery({ name: 'latest', required: false, example: true })
  @ApiQuery({
    name: 'hashTags',
    required: false,
    type: [String],
    example: ['#tech', '#ai'],
  })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  @Get('/event/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Auth()
  async getAll(@Query() dto: AdminEventFilters) {
    console.log(dto);
    return this.eventService.getEventsAdmin(dto);
  }

  @Patch('/event/update/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Обновить событие по ID' })
  @ApiParam({ name: 'id', type: String, example: 'event12345' })
  @ApiBody({
    type: CreateEventDto,
    examples: {
      updated: {
        value: {
          title: 'Updated Tech Meetup',
          description: 'Updated description',
          eventDate: '2025-06-20',
          eventTime: '14:00-17:00',
          hashTags: '["update"]',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Событие обновлено' })
  @Auth()
  async updateEvent(
    @Param('id') eventId: string,
    @Body() dto: CreateEventDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.eventService.update(eventId, dto, image);
  }

  @ApiOperation({ summary: 'Удалить событие по ID' })
  @ApiParam({ name: 'id', type: String, example: 'event12345' })
  @Delete('/event/delete/:id')
  @Auth()
  async deleteEvent(@Param('id') eventId: string) {
    return this.eventService.delete(eventId);
  }

  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiParam({ name: 'id', type: String, example: 'event12345' })
  @Get('/event/:id')
  @Auth()
  async getEventByIdAdmin(@Param('id') eventId: string) {
    return this.eventService.getByIdAdmin(eventId);
  }

  @ApiOperation({ summary: 'Удалить участника из события' })
  @ApiParam({ name: 'eventId', type: String, example: 'event12345' })
  @ApiParam({ name: 'userId', type: String, example: 'user98765' })
  @Delete('/event/:eventId/kick/:userId')
  @Auth()
  async deleteEventMember(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventService.deleteEventMember(eventId, userId);
  }

  @ApiOperation({ summary: 'Получить всех пользователей Telegram' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Строка для поиска по nickname или telegramUsername',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
  })
  @Get('/user/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Auth()
  async getAllUsersAdmin(@Query() dto?: AdminUserFilters) {
    console.log(dto);
    return this.userService.getAllUsersByAdmin(dto);
  }

  @ApiOperation({
    summary: 'Получить путь до документа с информацией о мероприятии',
  })
  @Get('/event/export/:id')
  @Auth()
  async exportEventToDocx(@Param('id') eventId: string) {
    const response = await this.eventService.exportEventToDocx(eventId);

    return response;
  }

  @ApiOperation({
    summary:
      'Удалить пользователя (Все его участия в мероприятиях и отзывы автоматически удаляются вместе с ним)',
  })
  @Delete('/user/delete/:id')
  @Auth()
  async deleteUser(@Param('id') userId: string) {
    const response = await this.userService.deleteUser(userId);

    return response;
  }

  @ApiOperation({
    summary: 'Удалить отзыв',
  })
  @Delete('/feedback/delete/:id')
  @Auth()
  async deleteFeedback(@Param('id') feedbackId: string) {
    return await this.feedbackService.deleteFeedback(feedbackId);
  }
}
