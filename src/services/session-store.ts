"use server";

import UserInfo from "@/data/user-info";
import { cookies } from "next/headers";

export async function getSessionFromDatabase(token: string) {
  const cookieLocal = await cookies();
  const session =
    token || (cookieLocal.get("sso_token_plain")?.value as string);

  const sessionDB = await UserInfo({
    access_token: session,
  });

  if (!sessionDB.response.status) {
    return sessionDB.response.status;
  }

  return true;
}
