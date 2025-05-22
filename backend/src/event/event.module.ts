import { Module } from '@nestjs/common';
import { EventImageModule } from '../event-image/event-image.module';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [UserModule, EventImageModule],
  controllers: [EventController],
  providers: [EventService, PrismaService],
  exports: [EventService],
})
export class EventModule {}
