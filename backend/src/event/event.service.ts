import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventFilters } from './dto/event.filters';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getEvents(filters?: EventFilters) {
    const { title, latest } = filters || {};
    let { hashTags } = filters || {};

    if (typeof hashTags === 'string') {
      try {
        const parsed = JSON.parse(hashTags);
        if (Array.isArray(parsed)) {
          hashTags = parsed;
        } else {
          hashTags = [];
        }
      } catch (err) {
        console.warn('Не удалось распарсить hashTags:', err);
        hashTags = [];
      }
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

    if (Array.isArray(hashTags) && hashTags.length > 0) {
      andConditions.push({
        hashTags: {
          hasSome: hashTags,
        },
      });
    }

    const where: Prisma.EventWhereInput = andConditions.length
      ? { AND: andConditions }
      : {};

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
      },
    });

    if (!event) throw new NotFoundException('Event to found');

    return event;
  }

  async giveEventFeedback() {}

  // ADMIN
  async create(adminId: string, dto: CreateEventDto) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw new ForbiddenException(
        'Administrator not found. Access forbidden!!',
      );
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

    return event;
  }

  async update() {}
  async delete() {}
  async getByIdAdmin() {}
  async deleteEventMember() {}

  // CRON задача на смену статуса на архивный, после окончания даты проведения мероприятия
  async updateEventStatus() {}

  // Методы для создания документов и выгрузки
}
