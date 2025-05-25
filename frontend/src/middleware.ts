import { NextRequest, NextResponse } from "next/server";
import { protectAdminPages } from "./lib/modules/server-actions/middlewares/protect-admin.middleware";
import { protectLoginPages } from "./lib/modules/server-actions/middlewares/protect-login.middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/auth") {
    console.log("БРЕДИК");
    return protectLoginPages(request);
  }

  if (pathname.startsWith("/dashboard")) {
    return protectAdminPages(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/dashboard/:path*"],
};
