import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { ContinueRegistrationDto } from './dto/contrinue-registration.dto';
import { ITelegramUser } from './types/tg-user-info.types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getProfile(tgUser: ITelegramUser) {
    const telegramId = tgUser.id.toString();

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      const newUser = await this.prisma.user.create({
        data: {
          telegramId: telegramId,
          telegramUsername: tgUser.username,
          telegramFirstName: tgUser.first_name ? tgUser.first_name : null,
          telegramLastName: tgUser.last_name ? tgUser.last_name : null,
          photoUrl: tgUser.photo_url ? tgUser.photo_url : null,
        },
      });

      return {
        ...newUser,
        telegramId: newUser.telegramId.toString(),
      };
    }

    return {
      ...user,
      telegramId: user.telegramId.toString(),
    };
  }

  async ContinueRegistrationDto(
    userTgId: string,
    dto: ContinueRegistrationDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: userTgId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.nickname && user.yearOfBirth)
      throw new BadRequestException('User already registered');

    const updated = await this.prisma.user.update({
      where: {
        telegramId: userTgId,
      },
      data: {
        nickname: dto.nickname,
        userCategory: dto.userCategory,
        yearOfBirth: dto.yearOfBirth,
      },
    });

    return updated;
  }
}
