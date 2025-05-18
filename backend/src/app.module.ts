import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AppController } from './app.controller';
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
