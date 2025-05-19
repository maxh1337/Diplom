import { Request } from 'express';

export function getClientIp(req: Request): string {
  // 1. Попробовать req.ip (учитывает x-forwarded-for, если trust proxy включён)
  let ip = req.ip;

  // 2. Если req.ip пустой или локальный, проверить x-forwarded-for
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      ip = forwarded.split(',')[0]?.trim();
    } else if (Array.isArray(forwarded)) {
      ip = forwarded[0]?.trim();
    }
  }

  // 3. Если всё ещё нет, использовать req.socket.remoteAddress
  if (!ip) {
    ip = req.socket.remoteAddress;
  }

  // 4. Проверка валидности IP (опционально)
  if (!ip || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]{2,}$/.test(ip)) {
    ip = 'unknown';
  }

  return ip;
}
