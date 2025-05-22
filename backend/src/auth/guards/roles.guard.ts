import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Admin, AdminRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<AdminRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: Admin }>();
    const admin = request.user as Admin;

    const hasRole = () => admin.rights.some((role) => roles.includes(role));
    if (!hasRole()) {
      throw new ForbiddenException('У тебя недостаточно полномочий!');
    }

    return true;
  }
}
