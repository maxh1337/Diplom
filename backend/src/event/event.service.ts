import { ForbiddenException, Injectable } from '@nestjs/common';
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
  async getById() {}
  async deleteEventMember() {}

  // CRON задача на смену статуса на архивный, после окончания даты проведения мероприятия
  async updateEventStatus() {}

  // Методы для создания документов и выгрузки
}
