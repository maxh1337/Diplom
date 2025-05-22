import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AdminService } from '../admin/admin.service';
import { getClientIp } from '../utils/get-current-user-ip';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly adminService: AdminService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('auth/login')
  @ApiOperation({ summary: 'Логин администратора' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход. Устанавливаются JWT куки.',
  })
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const ipAddress = getClientIp(req);
    const { admin, tokens } = await this.authService.login(dto, ipAddress);

    this.refreshTokenService.addAccessTokenToResponse(res, tokens.accessToken);
    this.refreshTokenService.addRefreshTokenToResponse(
      res,
      tokens.refreshToken,
    );

    return { admin };
  }

  @HttpCode(200)
  @Post('auth/access-token')
  @ApiOperation({ summary: 'Обновить Access Token по Refresh Token (из куки)' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: 'Новый access и refresh токен выданы',
  })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.refreshTokenService.removeTokensFromResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }

    const { admin, tokens } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.refreshTokenService.addAccessTokenToResponse(res, tokens.accessToken);
    this.refreshTokenService.addRefreshTokenToResponse(
      res,
      tokens.refreshToken,
    );

    return { admin };
  }

  @HttpCode(200)
  @Post('auth/logout')
  @ApiOperation({ summary: 'Выход администратора' })
  @ApiResponse({ status: 200, description: 'JWT токены удалены из куки' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenService.removeTokensFromResponse(res);
    return true;
  }
}
