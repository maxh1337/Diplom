"use server";

import * as jose from "jose";
import { transformAdminToState } from "../../../../shared/utils/transform-user-to-state";
import { ITokenInside } from "../../auth/auth.types";

export async function jwtVerifyServer(accessToken: string) {
  try {
    const { payload }: { payload: ITokenInside } = await jose.jwtVerify(
      accessToken,
      new TextEncoder().encode(`${process.env.JWT_SECRET}`)
    );

    if (!payload) return null;

    return transformAdminToState(payload);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("exp claim timestamp check failed")
    ) {
      console.log("Токен истек");
      return null;
    }

    console.log("Ошибка при верификации токена: ", error);
    return null;
  }
}
