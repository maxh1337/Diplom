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
import { Request, Response } from 'express';
import { AdminService } from '../admin/admin.service';
import { getClientIp } from '../utils/get-current-user-ip';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';
import { RefreshTokenService } from './refresh-token.service';
// import { Recaptcha } from '@nestlab/google-recaptcha'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly adminService: AdminService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  // @Recaptcha()
  @Post('auth/login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const ipAddress = getClientIp(req);
    const { user, tokens } = await this.authService.login(dto, ipAddress);

    this.refreshTokenService.addAccessTokenToResponse(res, tokens.accessToken);
    this.refreshTokenService.addRefreshTokenToResponse(
      res,
      tokens.refreshToken,
    );

    return { user };
  }

  @HttpCode(200)
  @Post('auth/access-token')
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

    const { user, tokens } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.refreshTokenService.addAccessTokenToResponse(res, tokens.accessToken);
    this.refreshTokenService.addRefreshTokenToResponse(
      res,
      tokens.refreshToken,
    );

    return { user };
  }

  @HttpCode(200)
  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenService.removeTokensFromResponse(res);

    return true;
  }
}
