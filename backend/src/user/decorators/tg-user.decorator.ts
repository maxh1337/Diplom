import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTgUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tgUser = request.tgUser;

    return data ? tgUser?.[data] : tgUser;
  },
);
