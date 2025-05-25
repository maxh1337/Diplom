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

  async getMyEvents(tgUser: ITelegramUser) {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: tgUser.id.toString(),
      },
      include: {
        events: {
          select: {
            id: true,
            title: true,
            image: true,
            description: true,
            participants: {
              select: {
                id: true,
              },
            },
            feedback: {
              select: {
                id: true,
                userId: true,
                rating: true,
                comment: true,
              },
            },
            eventDate: true,
            eventTime: true,
            hashTags: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const upcomingEvents = user?.events.filter((event) => event.isActive) ?? [];
    const pastEvents = user?.events.filter((event) => !event.isActive) ?? [];

    return {
      upcomingEvents: upcomingEvents,
      pastEvents: pastEvents,
    };
  }

  async getProfile(tgUser: ITelegramUser) {
    const telegramId = tgUser.id.toString();

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        events: {
          select: {
            id: true,
            eventDate: true,
            eventTime: true,
            isActive: true,
          },
        },
      },
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

  async getByTgId(tgId: string) {
    const tgUser = await this.prisma.user.findUnique({
      where: {
        telegramId: tgId,
      },
      include: {
        events: true,
        Feedback: true,
      },
    });

    if (!tgUser) {
      return null;
    }

    return tgUser;
  }

  async getAllUsersByAdmin() {
    return await this.prisma.user.findMany({
      include: {
        events: true,
        Feedback: true,
      },
    });
  }
}
