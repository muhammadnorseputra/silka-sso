"use server";

import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AES, enc } from "crypto-js";
import RefreshAccessToken from "@/data/refresh_access_token";

export default async function getSession() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get("sso_token");
  if (!cookie?.value) return;

  const tokenDycript = AES.decrypt(
    cookie.value,
    process.env.KEY_PASSPHRASE as string,
  ).toString(enc.Utf8);

  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(tokenDycript);
  } catch {
    return;
  }

  // Refresh otomatis jika access token expired
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    const refreshToken = cookieStore.get("sso_refresh_token")?.value;
    if (!refreshToken) return;

    const result = await RefreshAccessToken(refreshToken);
    if (!result.response?.status) return;

    const { access_token, refresh_token: newRefreshToken } = result.response;

    const tokenEnkripsi = AES.encrypt(
      access_token,
      process.env.KEY_PASSPHRASE as string,
    );
    cookieStore.set({
      name: "sso_token",
      value: tokenEnkripsi.toString(),
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });

    if (newRefreshToken) {
      cookieStore.set({
        name: "sso_refresh_token",
        value: newRefreshToken,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 86400,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return {
      cookie: cookieStore.get("sso_token"),
      decoded: jwtDecode<JwtPayload>(access_token),
      token_plain: access_token,
    };
  }

  return {
    cookie,
    decoded,
    token_plain: tokenDycript,
  };
}
