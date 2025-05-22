import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventImageController } from './event-image.controller';
import { EventImageService } from './event-image.service';

@Module({
  controllers: [EventImageController],
  providers: [EventImageService, PrismaService],
  exports: [EventImageService],
})
export class EventImageModule {}
