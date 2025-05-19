import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import prisma from '@prisma/client';

export const CurrentAdmin = createParamDecorator(
  (data: keyof prisma.Admin, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const admin = request.user;

    return data ? admin[data] : admin;
  },
);
