import { AdminRole } from "../admin/admin.types";

export const AuthToken = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export type AuthToken = (typeof AuthToken)[keyof typeof AuthToken];

export const CookieSettings = {
  ACCESS_TOKEN_MAX_AGE: 60 * 60, // 1 час для accessToken
  REFRESH_TOKEN_MAX_AGE: 24 * 60 * 60, // 1 день для refreshToken
  HTTP_ONLY: true,
  // SECURE: process.env.NODE_ENV === "production",
  SECURE: true,
  SAME_SITE:
    process.env.NODE_ENV === "production"
      ? ("lax" as const)
      : ("none" as const),
  PATH: "/dashboard",
} as const;

export type CookieSettings =
  (typeof CookieSettings)[keyof typeof CookieSettings];

export interface ITokenInside {
  id: string;
  rights: AdminRole[];
  iat: number;
  exp: number;
}

export type TProtectAdminData = Omit<ITokenInside, "iat" | "exp">;

export interface IFormData {
  login: string;
  password: string;
}
