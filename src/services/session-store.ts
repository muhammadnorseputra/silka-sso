"use server";

import UserInfo from "@/data/user-info";
import { AES, enc } from "crypto-js";
import { cookies } from "next/headers";

export async function getSessionFromDatabase(token: string) {
  const cookieLocal = await cookies();

  const token_plain = AES.decrypt(
    cookieLocal.get("sso_token")?.value as string,
    process.env.KEY_PASSPHRASE as string,
  ).toString(enc.Utf8);

  const session = token || token_plain;

  const sessionDB = await UserInfo({
    access_token: session,
  });

  if (!sessionDB.response.status) {
    return sessionDB.response.status;
  }

  return true;
}
