import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class RefreshTokenService {
  readonly EXPIRE_HOUR_ACCESS_TOKEN = 1;
  readonly EXPIRE_DAY_REFRESH_TOKEN = 1;
  readonly ACCESS_TOKEN_NAME = 'accessToken';
  readonly REFRESH_TOKEN_NAME = 'refreshToken';

  addAccessTokenToResponse(res: Response, accessToken: string) {
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + this.EXPIRE_HOUR_ACCESS_TOKEN);

    res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true, // true в продакшене
      sameSite: 'none', // lax в продакшене
    });
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true, // true в продакшене
      sameSite: 'none', // lax в продакшене
    });
  }

  removeTokensFromResponse(res: Response) {
    res.cookie(this.ACCESS_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true, // true в продакшене
      sameSite: 'none', // lax в продакшене
    });

    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true, // true в продакшене
      sameSite: 'none', // lax в продакшене
    });
  }
}
