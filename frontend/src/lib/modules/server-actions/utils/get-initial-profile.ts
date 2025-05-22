"use server";

import { cookies } from "next/headers";

export async function getInitialProfile(): Promise<{
  hasTokens: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken === undefined && refreshToken === undefined) {
    return { hasTokens: false };
  } else {
    return { hasTokens: true };
  }
}
