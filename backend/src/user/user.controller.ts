import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TgAuth } from './decorators/tg-auth.decorator';
import { CurrentTgUser } from './decorators/tg-user.decorator';
import { ContinueRegistrationDto } from './dto/contrinue-registration.dto';
import { ITelegramUser } from './types/tg-user-info.types';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/get-profile')
  @TgAuth()
  @ApiOperation({ summary: 'Получить профиль текущего Telegram-пользователя' })
  @ApiHeader({
    name: 'x-init-data',
    required: true,
    description: 'Telegram Init Data (подпись и информация из TGWebApp)',
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  async getProfile(@CurrentTgUser() telegramUser: ITelegramUser) {
    return this.userService.getProfile(telegramUser);
  }

  @Get('me/get-my-events')
  @TgAuth()
  @ApiOperation({
    summary: 'Получить события, на которые зарегистрирован пользователь',
  })
  @ApiHeader({
    name: 'x-init-data',
    required: true,
    description: 'Telegram Init Data',
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiResponse({ status: 200, description: 'Список событий пользователя' })
  async getMyEvents(@CurrentTgUser() telegramUser: ITelegramUser) {
    return this.userService.getMyEvents(telegramUser);
  }

  @Post('me/continue-registration/')
  @TgAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiOperation({
    summary: 'Завершение регистрации после входа через TG WebApp',
  })
  @ApiHeader({
    name: 'x-init-data',
    required: true,
    description: 'Telegram Init Data',
    example: 'query_id=A...&user=%7B%22id%22%3A1234...%7D',
  })
  @ApiBody({ type: ContinueRegistrationDto })
  @ApiResponse({ status: 200, description: 'Регистрация успешно завершена' })
  async ContinueRegistrationDto(
    @Body() dto: ContinueRegistrationDto,
    @CurrentTgUser() telegramUser: ITelegramUser,
  ) {
    return this.userService.ContinueRegistrationDto(
      telegramUser.id.toString(),
      dto,
    );
  }
}
