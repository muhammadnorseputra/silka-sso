"use server";

import UserInfo from "@/data/user-info";

export async function getSessionFromDatabase(token: string) {
  const sessionDB = await UserInfo({
    access_token: token,
  });

  if (!sessionDB.response.status) {
    return sessionDB.response.status;
  }

  return true;
}
