import { NextRequest } from "next/server";
import { ADMIN_PAGES } from "../../../../shared/config/pages/admin.config";
import { PUBLIC_PAGES } from "../../../../shared/config/pages/public.config";
import { nextRedirect } from "./next-redirect";

export const redirectToLoginOrNotFound = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith(ADMIN_PAGES.DASHBOARD);

  return nextRedirect(isAdminPage ? "/404" : PUBLIC_PAGES.LOGIN, request.url);
};
