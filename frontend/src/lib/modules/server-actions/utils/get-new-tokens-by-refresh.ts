"use server";

import { NextResponse } from "next/server";
import { API_URL } from "../../../constants/urls";
import { IAdmin } from "../../admin/admin.types";
import { AuthToken, CookieSettings } from "../../auth/auth.types";

interface IAuthResponse {
  admin: IAdmin;
}

export async function getNewTokensByRefresh(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${AuthToken.REFRESH_TOKEN}=${refreshToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch new tokens");
  }

  const data: IAuthResponse = await response.json();

  // Извлекаем новые токены из cookies ответа
  const cookies = response.headers.get("set-cookie")?.split(", ") || [];
  let accessToken = "";
  let newRefreshToken = refreshToken;

  for (const cookie of cookies) {
    if (cookie.includes(`${AuthToken.ACCESS_TOKEN}=`)) {
      accessToken = cookie.split(`${AuthToken.ACCESS_TOKEN}=`)[1].split(";")[0];
    }
    if (cookie.includes(`${AuthToken.REFRESH_TOKEN}=`)) {
      newRefreshToken = cookie
        .split(`${AuthToken.REFRESH_TOKEN}=`)[1]
        .split(";")[0];
    }
  }

  if (!accessToken) {
    throw new Error("No access token received");
  }

  // Создаем ответ с новыми cookies
  const nextResponse = NextResponse.json(data);
  nextResponse.cookies.set({
    name: AuthToken.ACCESS_TOKEN,
    value: accessToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.ACCESS_TOKEN_MAX_AGE,
  });
  nextResponse.cookies.set({
    name: AuthToken.REFRESH_TOKEN,
    value: newRefreshToken,
    httpOnly: CookieSettings.HTTP_ONLY,
    secure: CookieSettings.SECURE,
    sameSite: CookieSettings.SAME_SITE,
    path: CookieSettings.PATH,
    maxAge: CookieSettings.REFRESH_TOKEN_MAX_AGE,
  });

  return { response: nextResponse, accessToken, refreshToken: newRefreshToken };
}
