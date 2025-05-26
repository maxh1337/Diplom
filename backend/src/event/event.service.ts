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
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { promises as fs } from 'fs';
import { join } from 'path';
import { AdminEventFilters } from '../admin/dto/admin-event-filters.dto';
import { EventImageService } from '../event-image/event-image.service';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventFilters } from './dto/event-filters.dto';

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

    const events = await this.prisma.event.findMany({
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
        feedback: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                nickname: true,
                telegramUsername: true,
              },
            },
            event: {
              select: {
                id: true,
                title: true,
                administrator: true,
              },
            },
          },
        },
        administrator: {
          select: {
            id: true,
            username: true,
            login: true,
          },
        },
        image: true,
      },
      orderBy: [{ isActive: 'desc' }, { eventDate: 'asc' }],
      ...(latest && { take: 3 }),
    });

    return events;
  }

  async delete(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { image: true }, // Включаем связанное изображение
      });

      if (!event) {
        throw new NotFoundException('Событие не найдено');
      }

      // Найти связанное изображение
      const existingImage = event.image;

      if (existingImage) {
        // Удаляем запись об изображении из базы данных
        await this.prisma.eventImage.delete({
          where: { id: existingImage.id },
        });

        // Удаляем файл изображения из папки, если он существует
        const imagePath = join(process.cwd(), existingImage.path);
        await fs.rm(imagePath, { force: true }).catch((err) => {
          console.error(
            `Ошибка при удалении файла изображения ${imagePath}:`,
            err,
          );
          // Игнорируем ошибку, чтобы продолжить удаление события
        });
      }

      // Удаляем само событие
      await this.prisma.event.delete({
        where: { id: eventId },
      });

      return { message: 'Событие успешно удалено' };
    } catch (err) {
      console.error('Ошибка при удалении события:', err);
      throw err;
    }
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
  async exportEventToDocx(eventId: string): Promise<{ path: string }> {
    this.logger.log(`Starting export for event ID: ${eventId}`);
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
        image: true,
        administrator: {
          select: { username: true },
        },
      },
    });

    if (!event) {
      this.logger.error(`Event with ID ${eventId} not found`);
      throw new NotFoundException('Событие не найдено');
    }

    // Создание документа
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Заголовок
            new Paragraph({
              text: event.title,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  size: 28,
                  bold: true,
                  color: '2F5496',
                }),
              ],
            }),

            // Информация о событии
            new Paragraph({
              children: [
                new TextRun({
                  text: `Описание: ${event.description || 'Нет описания'}`,
                  size: 24,
                  color: '000000',
                }),
                new TextRun({
                  text: `Дата: ${event.eventDate.toLocaleDateString('ru-RU')} ${event.eventTime}`,
                  break: 1,
                  size: 24,
                  color: '000000',
                }),
                new TextRun({
                  text: `Администратор: ${event.administrator?.username || 'Не указан'}`,
                  break: 1,
                  size: 24,
                  color: '000000',
                }),
                new TextRun({
                  text: `Теги: ${event.hashTags.join(', ') || 'Нет тегов'}`,
                  break: 1,
                  size: 24,
                  color: '000000',
                }),
              ],
              spacing: { before: 200, after: 200 },
            }),

            // Участники
            new Paragraph({
              text:
                event.participants.length > 0
                  ? 'Участники:'
                  : 'Участники: Нет зарегистрированных участников',
              spacing: { before: 400, after: 200 },
              children: [
                new TextRun({
                  size: 24,
                  color: '000000',
                }),
              ],
            }),

            // Таблица участников (если есть)
            ...(event.participants.length > 0
              ? [
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph('Никнейм/Юзернейм')],
                            shading: { fill: 'D3D3D3' },
                          }),
                          new TableCell({
                            children: [new Paragraph('Категория')],
                            shading: { fill: 'D3D3D3' },
                          }),
                          new TableCell({
                            children: [new Paragraph('Год рождения')],
                            shading: { fill: 'D3D3D3' },
                          }),
                        ],
                      }),
                      ...event.participants.map(
                        (participant) =>
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Paragraph(
                                    participant.nickname ||
                                      participant.telegramUsername ||
                                      'Не указано',
                                  ),
                                ],
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph(
                                    participant.userCategory || 'Не указано',
                                  ),
                                ],
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph(
                                    participant.yearOfBirth?.toString() ||
                                      'Не указано',
                                  ),
                                ],
                              }),
                            ],
                          }),
                      ),
                    ],
                  }),
                ]
              : []),

            // Обратная связь
            new Paragraph({
              text:
                event.feedback.length > 0
                  ? 'Обратная связь:'
                  : 'Обратная связь: Нет отзывов',
              spacing: { before: 400, after: 200 },
              children: [
                new TextRun({
                  size: 24,
                  color: '000000',
                }),
              ],
            }),

            // Список обратной связи (если есть)
            ...(event.feedback.length > 0
              ? event.feedback.map(
                  (feedback) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Оценка: ${feedback.rating}`,
                          bold: true,
                          size: 24,
                          color: '000000',
                        }),
                        new TextRun({
                          text: `, Комментарий: ${feedback.comment || 'Нет комментария'}`,
                          break: 1,
                          size: 24,
                          color: '000000',
                        }),
                      ],
                      spacing: { before: 100, after: 100 },
                    }),
                )
              : []),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    const uploadsDir = join(process.cwd(), 'uploads/exported-word');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filename = `event-${eventId}.docx`;
    const filePath = join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    return { path: `uploads/exported-word/${filename}` };
  }
}
