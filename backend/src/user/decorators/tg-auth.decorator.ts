import { applyDecorators, UseGuards } from '@nestjs/common';
import { TgAuthGuard } from '../guard/tg-auth.guard';

export const TgAuth = () => {
  return applyDecorators(UseGuards(TgAuthGuard));
};
