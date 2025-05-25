import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventImageService {
  constructor(private readonly prisma: PrismaService) {}

  async createImage(eventId: string, file: Express.Multer.File) {
    try {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Можно загружать только изображения');
      }

      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        throw new BadRequestException('Максимальный размер изображения — 5MB');
      }

      const uploadsDir = join(process.cwd(), 'uploads/event-images'); // Используем process.cwd()
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExt = extname(file.originalname).toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      if (!validExtensions.includes(fileExt)) {
        throw new BadRequestException(
          'Поддерживаются только форматы: .jpg, .jpeg, .png, .gif',
        );
      }

      const fileName = `${uuid()}${fileExt}`;
      const filePath = join(uploadsDir, fileName);

      try {
        await fs.writeFile(filePath, file.buffer);
        console.log(`Файл успешно записан в: ${filePath}`);
      } catch (error) {
        throw new BadRequestException(
          `Ошибка записи изображения: ${error.message}`,
        );
      }

      await this.prisma.eventImage.create({
        data: {
          eventId,
          path: `uploads/event-images/${fileName}`,
        },
      });
    } catch (err) {
      console.error('Ошибка при создании изображения:', err);
      throw err;
    }
  }

  async updateImage(eventId: string, file: Express.Multer.File) {
    try {
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
        const oldPath = join(process.cwd(), existingImage.path);
        await fs.rm(oldPath, { force: true }).catch(() => null); // Игнорируем ошибки удаления
        await this.prisma.eventImage.delete({
          where: { id: existingImage.id },
        });
      }

      const uploadsDir = join(process.cwd(), 'uploads/event-images');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExt = extname(file.originalname).toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      if (!validExtensions.includes(fileExt)) {
        throw new BadRequestException(
          'Поддерживаются только форматы: .jpg, .jpeg, .png, .gif',
        );
      }

      const fileName = `${uuid()}${fileExt}`;
      const filePath = join(uploadsDir, fileName);

      try {
        await fs.writeFile(filePath, file.buffer); // Прямая запись буфера
        console.log(`Файл успешно записан в: ${filePath}`);
      } catch (error) {
        throw new BadRequestException(
          `Ошибка записи изображения: ${error.message}`,
        );
      }

      await this.prisma.eventImage.create({
        data: {
          eventId,
          path: `uploads/event-images/${fileName}`, // Абсолютный путь
        },
      });
    } catch (err) {
      console.error('Ошибка при обновлении изображения:', err);
      throw err;
    }
  }
}
