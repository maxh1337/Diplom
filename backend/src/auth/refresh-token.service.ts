import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Injectable()
export class RefreshTokenService {
  readonly EXPIRE_HOUR_ACCESS_TOKEN = 1;
  readonly EXPIRE_DAY_REFRESH_TOKEN = 1;
  readonly ACCESS_TOKEN_NAME = 'accessToken';
  readonly REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(private readonly configService: ConfigService) {}

  private isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  private getCookieOptions(expires: Date) {
    return {
      httpOnly: true,
      domain: this.isProduction() ? '.ya-budu.ru' : 'localhost',
      expires,
      secure: true,
      sameSite: this.isProduction() ? 'lax' : ('none' as 'lax' | 'none'),
    };
  }

  addAccessTokenToResponse(res: Response, accessToken: string) {
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + this.EXPIRE_HOUR_ACCESS_TOKEN);

    res.cookie(
      this.ACCESS_TOKEN_NAME,
      accessToken,
      this.getCookieOptions(expiresIn),
    );
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(
      this.REFRESH_TOKEN_NAME,
      refreshToken,
      this.getCookieOptions(expiresIn),
    );
  }

  removeTokensFromResponse(res: Response) {
    const expiredDate = new Date(0);

    res.cookie(this.ACCESS_TOKEN_NAME, '', this.getCookieOptions(expiredDate));
    res.cookie(this.REFRESH_TOKEN_NAME, '', this.getCookieOptions(expiredDate));
  }
}
