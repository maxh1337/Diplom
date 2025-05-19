import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string) {
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

    const adminUsername = `admin_${randomBytes(4).toString('hex')}`;
    const adminPassword = randomBytes(8).toString('hex');

    await this.prisma.admin.create({
      data: {
        username: adminUsername,
        password: await hash(adminPassword),
      },
    });

    return {
      username: adminUsername,
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

  async getByUsername(username: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        username: username,
      },
    });

    return admin;
  }
}
