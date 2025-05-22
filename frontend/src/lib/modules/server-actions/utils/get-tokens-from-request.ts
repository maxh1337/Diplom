import { NextRequest, NextResponse } from "next/server";
import { AuthToken, CookieSettings } from "../../auth/auth.types";
import { getNewTokensByRefresh } from "./get-new-tokens-by-refresh";

export async function getTokensFromRequest(request: NextRequest) {
  const refreshToken = request.cookies.get(AuthToken.REFRESH_TOKEN)?.value;
  let accessToken = request.cookies.get(AuthToken.ACCESS_TOKEN)?.value;

  if (!refreshToken) {
    const response = NextResponse.next();
    response.cookies.delete(AuthToken.ACCESS_TOKEN);
    response.cookies.delete(AuthToken.REFRESH_TOKEN);
    return { tokens: null, response };
  }

  if (!accessToken) {
    try {
      const {
        response,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await getNewTokensByRefresh(refreshToken);
      accessToken = newAccessToken;
      return {
        tokens: { accessToken, refreshToken: newRefreshToken },
        response,
      };
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete(AuthToken.ACCESS_TOKEN);
      response.cookies.delete(AuthToken.REFRESH_TOKEN);
      console.error("Error refreshing tokens:", error);
      return { tokens: null, response };
    }
  }

  const response = NextResponse.next();
  response.cookies.set({
    name: AuthToken.ACCESS_TOKEN,
    value: accessToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set({
    name: AuthToken.REFRESH_TOKEN,
    value: refreshToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
  });

  return { tokens: { accessToken, refreshToken }, response };
}
