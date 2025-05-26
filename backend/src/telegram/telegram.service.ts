import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

const replyMarkup = (ctx) => {
  return `🤖 Привет <b>${ctx.from.username || 'гость'}!</b>

Это демонстрация работы <b>Telegram Mini App</b> для стартапа <i>"Развитие цифровой среды кафедры"</i>.

🧠 Мы разработали Telegram-бота, использующего возможности <b>искусственного интеллекта</b> для помощи пользователям в использовании нашего <b>Telegram Mini Apps</b>.

В нашем случае, искусственный интеллект может помочь пользователям с выбором нужного или интересного им мероприятия.

<b>💡 Почему Mini Apps лучше обычных ботов?</b>
• Позволяют создавать <b>полноценный интерфейс</b> прямо внутри Telegram — без перехода на сайт.
• Пользователь остаётся <b>внутри приложения</b>, что удобнее и быстрее.
• Интеграция с Telegram Login даёт <b>быструю и безопасную авторизацию</b>.

🚀 <b>Mini Apps — это удобный путь к цифровизации, доступный прямо в привычном мессенджере!</b>

📜 <b>Доступные команды:</b>
/start - Запустить бота
/help - Показать список команд`;
};

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
    if (!webAppUrl) {
      console.error('❌ WEBAPP_URL is not defined');
      throw new Error('WEBAPP_URL is not defined');
    }

    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Запустить бота и открыть WebApp' },
    ]);

    this.bot.start((ctx) => {
      ctx.reply(replyMarkup(ctx), {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Открыть WebApp', web_app: { url: webAppUrl } }],
            [{ text: '📜 Показать команды', callback_data: 'show_commands' }],
          ],
        },
      });
    });

    this.bot.action('show_commands', (ctx) => {
      ctx.reply(
        `📜 <b>Список команд:</b>
/start - Запустить бота и открыть WebApp
/help - Показать этот список команд`,
        { parse_mode: 'HTML' },
      );
    });

    this.bot.command('help', (ctx) => {
      ctx.reply(
        `📜 <b>Список команд:</b> 
/start - Запустить бота и открыть WebApp
/help - Показать этот список команд`,
        { parse_mode: 'HTML' },
      );
    });

    this.bot.on('message', (ctx) => {
      if (
        'text' in ctx.message &&
        (!ctx.message.text || !ctx.message.text.startsWith('/'))
      ) {
        ctx.reply(
          '👋 Привет! Чтобы начать, используй команду /start или выбери её из меню.',
          {
            parse_mode: 'HTML',
            reply_markup: {
              keyboard: [[{ text: '/start' }, { text: '/help' }]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
      }
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
