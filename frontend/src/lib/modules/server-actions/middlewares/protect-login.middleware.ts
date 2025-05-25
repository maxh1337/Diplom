// "use server";

// import { type NextRequest } from "next/server";
// import { ADMIN_PAGES } from "../../../../shared/config/pages/admin.config";
// import { COOKIE_DOMAIN } from "../../../constants/cookie-domain";
// import { AuthToken, CookieSettings } from "../../auth/auth.types";
// import { getTokensFromRequest } from "../utils/get-tokens-from-request";
// import { jwtVerifyServer } from "../utils/jwt-verify";
// import { nextRedirect } from "../utils/next-redirect";

// export async function protectLoginPages(request: NextRequest) {
//   const { tokens, response } = await getTokensFromRequest(request);
//   if (!tokens) return response;

//   const verifiedData = await jwtVerifyServer(tokens.accessToken);

//   if (!verifiedData) return response;

//   // Авторизован — редирект на /dashboard
//   const redirectResponse = nextRedirect(ADMIN_PAGES.HOME, request.url);

//   const accessTokenCookie = response.cookies.get(AuthToken.ACCESS_TOKEN);
//   const refreshTokenCookie = response.cookies.get(AuthToken.REFRESH_TOKEN);

//   if (accessTokenCookie) {
//     redirectResponse.cookies.set({
//       name: AuthToken.ACCESS_TOKEN,
//       value: accessTokenCookie.value,
//       httpOnly: CookieSettings.HTTP_ONLY,
//       secure: CookieSettings.SECURE,
//       domain: COOKIE_DOMAIN,
//       sameSite: CookieSettings.SAME_SITE,
//       path: CookieSettings.PATH,
//       maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
//     });
//   }

//   if (refreshTokenCookie) {
//     redirectResponse.cookies.set({
//       name: AuthToken.REFRESH_TOKEN,
//       value: refreshTokenCookie.value,
//       httpOnly: CookieSettings.HTTP_ONLY,
//       secure: CookieSettings.SECURE,
//       domain: COOKIE_DOMAIN,
//       sameSite: CookieSettings.SAME_SITE,
//       path: CookieSettings.PATH,
//       maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
//     });
//   }

//   return redirectResponse;
// }

"use server";

import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_PAGES } from "../../../../shared/config/pages/admin.config";
import { getTokensFromRequest } from "../utils/get-tokens-from-request";
import { jwtVerifyServer } from "../utils/jwt-verify";

export async function protectLoginPages(request: NextRequest) {
  const { tokens, response } = await getTokensFromRequest(request);
  if (!tokens) return response;

  const verifiedData = await jwtVerifyServer(tokens.accessToken);
  if (!verifiedData) return response;

  const pathname = new URL(request.url).pathname;

  if (pathname.startsWith(ADMIN_PAGES.HOME)) {
    console.log("Я на админской странице", pathname);
    return response;
  }

  console.log("БРЕДИК 2", pathname);
  const redirectResponse = NextResponse.redirect(
    new URL(ADMIN_PAGES.HOME, request.url)
  );

  // Переносим куки
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
