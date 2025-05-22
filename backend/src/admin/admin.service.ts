import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma.service';
import { UpdateAdminFieldsDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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
}
