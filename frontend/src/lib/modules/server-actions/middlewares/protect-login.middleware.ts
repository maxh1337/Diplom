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
    return response;
  }

  const redirectResponse = NextResponse.redirect(
    new URL(ADMIN_PAGES.HOME, request.url)
  );

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}
