"use server";

import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_PAGES } from "../../../../shared/config/pages/public.config";
import { AuthToken, CookieSettings } from "../../auth/auth.types";
import { getTokensFromRequest } from "../utils/get-tokens-from-request";
import { jwtVerifyServer } from "../utils/jwt-verify";
import { nextRedirect } from "../utils/next-redirect";
import { COOKIE_DOMAIN } from "../../../constants/cookie-domain";

export async function protectAdminPages(request: NextRequest) {
  const { tokens, response } = await getTokensFromRequest(request);

  if (!tokens) {
    const redirectResponse = nextRedirect(PUBLIC_PAGES.LOGIN, request.url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set({
        name: cookie.name,
        value: cookie.value,
        httpOnly: CookieSettings.HTTP_ONLY,
        secure: CookieSettings.SECURE,
        domain: COOKIE_DOMAIN,
        sameSite: CookieSettings.SAME_SITE,
        path: CookieSettings.PATH,
        maxAge:
          cookie.name === AuthToken.ACCESS_TOKEN
            ? CookieSettings.ACCESS_TOKEN_MAX_AGE
            : CookieSettings.REFRESH_TOKEN_MAX_AGE,
      });
    });
    return redirectResponse;
  }

  const verifiedData = await jwtVerifyServer(tokens.accessToken);

  if (!verifiedData || typeof verifiedData !== "object" || !verifiedData.id) {
    const redirectResponse = nextRedirect(PUBLIC_PAGES.LOGIN, request.url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set({
        name: cookie.name,
        value: cookie.value,
        httpOnly: CookieSettings.HTTP_ONLY,
        secure: CookieSettings.SECURE,
        domain: COOKIE_DOMAIN,
        sameSite: CookieSettings.SAME_SITE,
        path: CookieSettings.PATH,
        maxAge:
          cookie.name === AuthToken.ACCESS_TOKEN
            ? CookieSettings.ACCESS_TOKEN_MAX_AGE
            : CookieSettings.REFRESH_TOKEN_MAX_AGE,
      });
    });
    return redirectResponse;
  }

  const nextResponse = NextResponse.next();
  nextResponse.cookies.set({
    name: AuthToken.ACCESS_TOKEN,
    value: tokens.accessToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    domain: COOKIE_DOMAIN,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
  });
  nextResponse.cookies.set({
    name: AuthToken.REFRESH_TOKEN,
    value: tokens.refreshToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    domain: COOKIE_DOMAIN,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
  });

  return nextResponse;
}
