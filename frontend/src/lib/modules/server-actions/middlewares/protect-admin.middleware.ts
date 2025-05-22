"use server";

import { NextResponse, type NextRequest } from "next/server";
import { AuthToken, CookieSettings } from "../../auth/auth.types";
import { getTokensFromRequest } from "../utils/get-tokens-from-request";
import { jwtVerifyServer } from "../utils/jwt-verify";
import { redirectToLoginOrNotFound } from "../utils/redirect-to-login-or-404";

export async function protectAdminPages(request: NextRequest) {
  const { tokens, response } = await getTokensFromRequest(request);

  if (!tokens) {
    return redirectWithCookies(request, response);
  }

  const verifiedData = await jwtVerifyServer(tokens.accessToken);
  if (!verifiedData) {
    return redirectWithCookies(request, response);
  }

  // Продление токенов
  response.cookies.set({
    name: AuthToken.ACCESS_TOKEN,
    value: tokens.accessToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set({
    name: AuthToken.REFRESH_TOKEN,
    value: tokens.refreshToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
  });

  return response;
}

function redirectWithCookies(request: NextRequest, response: NextResponse) {
  const redirectResponse = redirectToLoginOrNotFound(request);

  const accessTokenCookie = response.cookies.get(AuthToken.ACCESS_TOKEN);
  const refreshTokenCookie = response.cookies.get(AuthToken.REFRESH_TOKEN);

  if (accessTokenCookie) {
    redirectResponse.cookies.set({
      name: AuthToken.ACCESS_TOKEN,
      value: accessTokenCookie.value,
      httpOnly: CookieSettings.HTTP_ONLY,
      secure: CookieSettings.SECURE,
      sameSite: CookieSettings.SAME_SITE,
      path: CookieSettings.PATH,
      maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
    });
  }

  if (refreshTokenCookie) {
    redirectResponse.cookies.set({
      name: AuthToken.REFRESH_TOKEN,
      value: refreshTokenCookie.value,
      httpOnly: CookieSettings.HTTP_ONLY,
      secure: CookieSettings.SECURE,
      sameSite: CookieSettings.SAME_SITE,
      path: CookieSettings.PATH,
      maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
    });
  }

  return redirectResponse;
}
