"use server";

import { AES } from "crypto-js";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import AccessToken from "src/app/data/access_token";

export async function create(code: string | undefined) {
  const cookieStore = await cookies();

  const userinfo = await AccessToken(code as string);
  if (userinfo.response.status) {
    const tokenEnkripsi = AES.encrypt(
      userinfo.response.access_token,
      process.env.KEY_PASSPHRASE as string
    );
    // ACCESS TOKEN
    cookieStore.set({
      name: "sso_token",
      value: tokenEnkripsi.toString(),
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });
    // return permanentRedirect("/dashboard");
  }
  return permanentRedirect("/dashboard");
}
