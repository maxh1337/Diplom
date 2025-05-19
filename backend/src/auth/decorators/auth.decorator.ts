import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (roles: AdminRole | AdminRole[] = [AdminRole.PART]) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
};
