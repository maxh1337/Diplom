import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [EventModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
