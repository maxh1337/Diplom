import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { AdminEventFilters } from '../admin/dto/admin-event-filters.dto';
import { EventImageService } from '../event-image/event-image.service';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventFilters } from './dto/event-filters.dto';
import { SendFeedbackDto } from './dto/send-feeback.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly eventImageService: EventImageService,
  ) {}

  async getEvents(filters?: EventFilters) {
    const { title, latest } = filters || {};
    let { hashTags } = filters || {};

    if (typeof hashTags === 'string') {
      hashTags = [hashTags];
    } else if (!Array.isArray(hashTags)) {
      hashTags = [];
    }

    const andConditions: Prisma.EventWhereInput[] = [];

    if (title?.trim()) {
      andConditions.push({
        title: {
          contains: title.trim(),
          mode: 'insensitive',
        },
      });
    }

    if (hashTags.length > 0) {
      andConditions.push({
        hashTags: {
          hasSome: hashTags,
        },
      });
    }

    const where: Prisma.EventWhereInput = andConditions.length
      ? { AND: andConditions }
      : {
          isActive: true,
        };

    let events = await this.prisma.event.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        eventTime: true,
        hashTags: true,
        participants: true,
        image: {
          select: {
            id: true,
            path: true,
            createdAt: true,
            eventId: true,
          },
        },
      },
    });

    if (latest) {
      events = events
        .sort(
          (a, b) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
        )
        .slice(0, 3);
    }

    return events;
  }

  async iWillGoOnEvent(telegramUserId: string, eventId: string) {
    const tgUser = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramUserId,
      },
      include: {
        events: true,
      },
    });

    if (!tgUser) throw new BadRequestException('User not found');

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        participants: true,
      },
    });

    if (!event) throw new BadRequestException('Event not found');

    const isParticipating = event.participants.find(
      (participant) => participant.id === tgUser.id,
    );

    if (isParticipating) {
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          participants: {
            disconnect: { id: tgUser.id },
          },
        },
      });
      return { isParticipating: false, message: 'You have left the event' };
    } else {
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          participants: {
            connect: { id: tgUser.id },
          },
        },
      });
      return { isParticipating: true, message: 'You have joined the event' };
    }
  }

  async getById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        hashTags: true,
        createdAt: true,
        eventDate: true,
        eventTime: true,
        adminId: false,
        administrator: false,
        participants: {
          select: {
            id: true,
          },
        },
        isActive: true,
        feedback: {
          select: {
            id: true,
            userId: true,
            rating: true,
            comment: true,
          },
        },
        image: {
          select: {
            id: true,
            path: true,
            createdAt: true,
            eventId: true,
          },
        },
      },
    });

    if (!event) throw new NotFoundException('Event to found');

    return event;
  }

  async sendFeedback(
    dto: SendFeedbackDto,
    telegramUserId: string,
    eventId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramUserId,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    const feedback = await this.prisma.feedback.create({
      data: {
        rating: dto.rating,
        comment: dto.comment ? dto.comment : null,
        user: {
          connect: {
            id: user.id,
          },
        },
        event: {
          connect: {
            id: event.id,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        rating: true,
        comment: true,
        eventId: true,
        userId: true,
      },
    });

    return feedback;
  }

  // ADMIN
  async create(
    adminId: string,
    dto: CreateEventDto,
    file?: Express.Multer.File,
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new ForbiddenException('Администратор не найден');
    }

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        hashTags: dto.hashTags,
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
        administrator: {
          connect: {
            id: adminId,
          },
        },
      },
    });

    if (file) {
      await this.eventImageService.createImage(event.id, file);
    }

    return event;
  }

  async update(
    eventId: string,
    dto: CreateEventDto,
    file?: Express.Multer.File,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        title: dto.title,
        description: dto.description,
        hashTags: dto.hashTags,
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
      },
    });

    if (file) {
      await this.eventImageService.updateImage(eventId, file);
    }

    return updatedEvent;
  }

  async getEventsAdmin(filters?: AdminEventFilters) {
    const { title, latest, isActive } = filters || {};
    let { hashTags } = filters || {};

    if (typeof hashTags === 'string') {
      hashTags = [hashTags];
    } else if (!Array.isArray(hashTags)) {
      hashTags = [];
    }

    const andConditions: Prisma.EventWhereInput[] = [];

    if (title?.trim()) {
      andConditions.push({
        title: {
          contains: title.trim(),
          mode: 'insensitive',
        },
      });
    }

    if (hashTags.length > 0) {
      andConditions.push({
        hashTags: {
          hasSome: hashTags,
        },
      });
    }

    const where: Prisma.EventWhereInput = andConditions.length
      ? { AND: andConditions }
      : {
          isActive: isActive,
        };

    let events = await this.prisma.event.findMany({
      where,
      include: {
        participants: {
          select: {
            id: true,
            nickname: true,
            telegramId: true,
            telegramUsername: true,
            telegramFirstName: true,
            telegramLastName: true,
            userCategory: true,
            yearOfBirth: true,
            photoUrl: true,
          },
        },
        feedback: true,
        administrator: {
          select: {
            id: true,
            username: true,
          },
        },
        image: true,
      },
    });

    if (latest) {
      events = events
        .sort(
          (a, b) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
        )
        .slice(0, 3);
    }

    return events;
  }

  async delete(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    return this.prisma.event.delete({
      where: { id: eventId },
    });
  }

  async getByIdAdmin(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: {
          select: {
            id: true,
            nickname: true,
            telegramId: true,
            telegramUsername: true,
            telegramFirstName: true,
            telegramLastName: true,
            userCategory: true,
            yearOfBirth: true,
            photoUrl: true,
          },
        },
        feedback: true,
        administrator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    return event;
  }

  async deleteEventMember(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    const isParticipant = event.participants.some((p) => p.id === userId);
    if (!isParticipant) {
      throw new NotFoundException(
        'Пользователь не является участником события',
      );
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          disconnect: { id: userId },
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivatePastEvents() {
    const now = new Date();

    const activeEvents = await this.prisma.event.findMany({
      where: { isActive: true },
    });

    for (const event of activeEvents) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, endTime] = event.eventTime.split('-');

      const [endHour, endMinute] = endTime.split(':').map(Number);

      const eventEnd = new Date(
        event.eventDate.getFullYear(),
        event.eventDate.getMonth(),
        event.eventDate.getDate(),
        endHour,
        endMinute,
        0,
        0,
      );

      if (now > eventEnd) {
        await this.prisma.event.update({
          where: { id: event.id },
          data: { isActive: false },
        });

        this.logger.log(
          `Событие "${event.title}" деактивировано. Конец: ${eventEnd.toISOString()}`,
        );
      }
    }
  }

  //
  //
  //
  // Методы для создания документов и выгрузки
}
