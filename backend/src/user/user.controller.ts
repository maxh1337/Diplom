import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TgAuth } from './decorators/tg-auth.decorator';
import { CurrentTgUser } from './decorators/tg-user.decorator';
import { ContinueRegistrationDto } from './dto/contrinue-registration.dto';
import { ITelegramUser } from './types/tg-user-info.types';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/get-profile')
  @TgAuth()
  async getProfile(@CurrentTgUser() telegramUser: ITelegramUser) {
    return this.userService.getProfile(telegramUser);
  }

  @Get('me/get-my-events')
  @TgAuth()
  async getMyEvents(@CurrentTgUser() telegramUser: ITelegramUser) {
    console.log('Get MY Events');
    return this.userService.getMyEvents(telegramUser);
  }

  @Post('me/continue-registration/')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @TgAuth()
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
