import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getUserFromInitData,
  validateInitData,
} from '../../utils/telegram.util';

export const TelegramUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const initData = request.headers['x-init-data'];

    const configService = new ConfigService();
    const botToken = configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (!initData || !validateInitData(initData, botToken)) {
      throw new UnauthorizedException('Invalid initData');
    }

    const user = getUserFromInitData(initData);
    if (!user) {
      throw new UnauthorizedException('Cannot parse user from initData');
    }

    return user;
  },
);
