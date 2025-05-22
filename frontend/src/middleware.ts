import { NextRequest, NextResponse } from "next/server";

import { protectAdminPages } from "./lib/modules/server-actions/middlewares/protect-admin.middleware";
import { protectLoginPages } from "./lib/modules/server-actions/middlewares/protect-login.middleware";
import { ADMIN_PAGES } from "./shared/config/pages/admin.config";
import { PUBLIC_PAGES } from "./shared/config/pages/public.config";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (pathname === PUBLIC_PAGES.LOGIN) {
    return protectLoginPages(request);
  }

  if (pathname.startsWith(ADMIN_PAGES.HOME)) {
    return protectAdminPages(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
