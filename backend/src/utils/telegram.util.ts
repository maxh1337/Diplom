import * as crypto from 'crypto';
import { ITelegramUser } from '../user/types/tg-user-info.types';

export function validateInitData(initData: string, botToken: string): boolean {
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN не определен');
    return false;
  }

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  if (!hash) {
    console.error('Поле hash отсутствует');
    return false;
  }

  data.delete('hash');

  const sorted = [...data.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(sorted)
    .digest('hex');

  return hmac === hash;
}

export function getUserFromInitData(initData: string): ITelegramUser | null {
  const params = new URLSearchParams(initData);
  const userRaw = params.get('user');
  if (!userRaw) {
    console.error('Поле user отсутствует');
    return null;
  }
  try {
    return JSON.parse(userRaw);
  } catch (err) {
    console.error('Ошибка парсинга user:', err);
    return null;
  }
}
