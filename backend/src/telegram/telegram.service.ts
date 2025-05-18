import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;

  constructor(private config: ConfigService) {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not defined');

    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    const webAppUrl = this.config.get<string>('WEBAPP_URL');

    this.bot.start((ctx) => {
      console.log('Получена команда /start от:', ctx.from);
      ctx.reply('Открыть WebApp:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Открыть WebApp', web_app: { url: webAppUrl } }],
          ],
        },
      });
    });

    try {
      this.bot
        .launch({ dropPendingUpdates: true })
        .then(() => {
          console.log('🤖 Telegram бот успешно запущен в режиме polling');
        })
        .catch((err) => {
          console.error('❌ Ошибка запуска Telegram-бота:', err);
        });
    } catch (err) {
      console.error('❌ Ошибка инициализации Telegram-бота:', err);
    }
  }

  async onModuleDestroy() {
    await this.bot.stop();
    console.log('🛑 Telegram бот остановлен');
  }

  async sendMessage(
    chatId: number,
    text: string,
  ): Promise<Message.TextMessage> {
    return this.bot.telegram.sendMessage(chatId, text);
  }
}
