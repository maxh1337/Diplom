import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config';
import { EventImageModule } from './event-image/event-image.module';
import { EventModule } from './event/event.module';
import { SeedModule } from './seed/seed.module';
import { TelegramModule } from './telegram/telegram.module';
import { UserModule } from './user/user.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getGoogleRecaptchaConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TelegramModule,
    UserModule,
    EventModule,
    AdminModule,
    AuthModule,
    EventImageModule,
    SeedModule,
    FeedbackModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
