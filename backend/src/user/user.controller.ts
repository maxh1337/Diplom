import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContinueRegistrationDto } from './dto/contrinue-registration.dto';
import { TelegramUser } from './guard/telegram.guard';
import { ITelegramUser } from './types/tg-user-info.types';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/get-profile')
  async getProfile(@TelegramUser() telegramUser: ITelegramUser) {
    return this.userService.getProfile(telegramUser);
  }

  @Post('me/continue-registration/')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async ContinueRegistrationDto(
    @Body() dto: ContinueRegistrationDto,
    @TelegramUser() user: ITelegramUser,
  ) {
    console.log(user);
    return this.userService.ContinueRegistrationDto(user.id.toString(), dto);
  }
}
