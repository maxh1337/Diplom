import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { Jimp } from 'jimp';
import { join, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventImageService {
  constructor(private readonly prisma: PrismaService) {}

  async createImage(eventId: string, file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Можно загружать только изображения');
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      throw new BadRequestException('Максимальный размер изображения — 5MB');
    }

    const uploadsDir = resolve(__dirname, '../../uploads/event-images');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${uuid()}.jpeg`;
    const filePath = join(uploadsDir, fileName);

    try {
      const image = await Jimp.read(file.buffer);
      const buffer = await image.getBuffer('image/jpeg', {
        quality: 80,
      });

      await fs.writeFile(filePath, buffer);
    } catch (error) {
      throw new BadRequestException(
        `Ошибка обработки изображения: ${error.message}`,
      );
    }

    await this.prisma.eventImage.create({
      data: {
        eventId,
        path: `uploads/event-images/${fileName}`,
      },
    });
  }

  async updateImage(eventId: string, file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Можно загружать только изображения');
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      throw new BadRequestException('Максимальный размер изображения — 5MB');
    }

    const existingImage = await this.prisma.eventImage.findFirst({
      where: { eventId },
    });

    // Удалить старое изображение и запись, если существует
    if (existingImage) {
      const oldPath = resolve(__dirname, '../../', existingImage.path);
      await fs.rm(oldPath, { force: true }).catch(() => null);
      await this.prisma.eventImage.delete({ where: { id: existingImage.id } });
    }

    const uploadsDir = resolve(__dirname, '../../uploads/event-images');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${uuid()}.jpeg`;
    const filePath = join(uploadsDir, fileName);

    try {
      const image = await Jimp.read(file.buffer);
      const buffer = await image.getBuffer('image/jpeg', { quality: 80 });
      await fs.writeFile(filePath, buffer);
    } catch (error) {
      throw new BadRequestException(
        `Ошибка обработки изображения: ${error.message}`,
      );
    }

    await this.prisma.eventImage.create({
      data: {
        eventId,
        path: `uploads/event-images/${fileName}`,
      },
    });
  }
}
