import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { titlesAndDescriptions } from './events';

@Injectable()
export class SeedService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly configService: ConfigService) {}

  async seedAdmin() {
    const adminLogin = this.configService.get<string>('ADMIN_LOGIN');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    console.log(adminLogin, adminPassword);

    if (!adminLogin || !adminPassword) {
      throw new Error(
        'ADMIN_LOGIN or ADMIN_PASSWORD is not set in environment variables',
      );
    }

    const hashedPassword = await argon2.hash(adminPassword);

    const admin = await this.prisma.admin.upsert({
      where: { login: adminLogin },
      update: {},
      create: {
        login: adminLogin,
        password: hashedPassword,
        rights: ['FULL', 'PART'],
      },
    });

    this.logger.log(`Admin user ensured: ${admin.login}`);
    await this.SeedEvents(admin.id);
  }

  async SeedEvents(adminId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const getTimeShiftedEvent = (baseDate: Date, hourStart: number) => {
      const eventDate = new Date(baseDate);
      eventDate.setHours(hourStart, 0, 0, 0);
      return {
        eventDate,
        eventTime: `${hourStart.toString().padStart(2, '0')}:00-${(hourStart + 3).toString().padStart(2, '0')}:00`,
      };
    };

    const events = titlesAndDescriptions.map((data, index) => {
      const baseDate = index < 5 ? today : tomorrow;
      const hourStart = 12 + (index % 5); // 12, 13, 14, 15, 16
      const { eventDate, eventTime } = getTimeShiftedEvent(baseDate, hourStart);

      return {
        title: data.title,
        description: data.description,
        hashTags: data.hashTags,
        eventDate,
        eventTime,
        adminId,
      };
    });

    await this.prisma.event.createMany({ data: events });

    this.logger.log('10 событий успешно созданы');
  }
}
