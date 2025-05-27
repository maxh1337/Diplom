import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { randomBytes } from 'crypto';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PrismaService } from '../prisma.service';
import { AdminSearchFiltersDto } from './dto/admin-getAll-filters.dto';
import { Stats } from './dto/stats.types';
import { UpdateAdminFieldsDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAdmins(dto?: AdminSearchFiltersDto) {
    const admins = await this.prisma.admin.findMany({
      where: {
        ...(dto.search
          ? {
              OR: [
                {
                  username: {
                    contains: dto.search,
                    mode: 'insensitive',
                  },
                },
                {
                  login: {
                    contains: dto.search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        username: true,
        login: true,
        rights: true,
        createdEvents: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            eventTime: true,
            isActive: true,
            description: true,
          },
        },
      },
    });
    return admins;
  }
  async getAdminProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        username: true,
        login: true,
        rights: true,
        createdEvents: true,
      },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }

  async createNewAdmin(creatorId: string) {
    const creator = await this.prisma.admin.findUnique({
      where: {
        id: creatorId,
      },
    });

    if (!creator || !creator.rights.includes('FULL')) {
      throw new BadRequestException(
        "You don't have enough rights to create new admins!",
      );
    }

    const adminLogin = `admin_${randomBytes(4).toString('hex')}`;
    const adminPassword = randomBytes(8).toString('hex');

    await this.prisma.admin.create({
      data: {
        login: adminLogin,
        password: await hash(adminPassword),
      },
    });

    return {
      login: adminLogin,
      password: adminPassword,
    };
  }

  async getById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      return null;
    }

    return admin;
  }

  async getByLogin(login: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        login: login,
      },
    });

    return admin;
  }

  async updateAdminProfile(adminId: string, dto: UpdateAdminFieldsDto) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return null;
    }

    return await this.prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        username: dto.username,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }

  async getStatistics(): Promise<Stats> {
    const totalAdmins = await this.prisma.admin.count();
    const events = await this.prisma.event.count();
    const activeEvents = await this.prisma.event.count({
      where: { isActive: true },
    });
    const totalUsers = await this.prisma.user.count();
    const feedbacks = await this.prisma.feedback.count();

    const months = 5;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const eventsList = await this.prisma.event.findMany({
      where: {
        eventDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        eventDate: true,
      },
    });

    const monthlyActivityMap = new Map<
      string,
      { users: number; events: number }
    >();

    for (let i = 0; i < months; i++) {
      const date = new Date(endDate);
      date.setMonth(endDate.getMonth() - (months - 1 - i));
      const monthName = format(date, 'LLLL', { locale: ru });
      monthlyActivityMap.set(monthName, { users: 0, events: 0 });
    }

    users.forEach((user) => {
      const monthName = format(new Date(user.createdAt), 'LLLL', {
        locale: ru,
      });
      console.log(monthName, 'Month Name');
      const monthData = monthlyActivityMap.get(monthName);
      if (monthData) {
        monthData.users += 1;
      }
    });

    eventsList.forEach((event) => {
      const monthName = format(new Date(event.eventDate), 'LLLL', {
        locale: ru,
      });
      const monthData = monthlyActivityMap.get(monthName);
      if (monthData) {
        monthData.events += 1;
      }
    });

    const stats = [
      { label: 'Администраторы', value: totalAdmins },
      { label: 'Все события', value: events },
      { label: 'Активные события', value: activeEvents },
      { label: 'Пользователи', value: totalUsers },
      { label: 'Отзывы', value: feedbacks },
    ];

    const chartData = Array.from(monthlyActivityMap.entries()).map(
      ([name, { users, events }]) => ({
        name,
        users,
        events,
      }),
    );

    return {
      stats,
      chartData,
    };
  }
}
