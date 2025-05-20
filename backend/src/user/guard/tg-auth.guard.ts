import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getUserFromInitData,
  validateInitData,
} from '../../utils/telegram.util';
import { UserService } from '../user.service';

@Injectable()
export class TgAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['x-init-data'];

    if (!initData) {
      throw new UnauthorizedException('The data from telegram not provided!');
    }

    if (!validateInitData(initData, botToken)) {
      throw new UnauthorizedException('Invalid initData');
    }

    const telegramUser = getUserFromInitData(initData);

    request.tgUser = telegramUser;

    return true;
  }
}
