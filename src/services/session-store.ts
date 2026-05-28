"use server";

import UserInfo from "@/data/user-info";

export async function getSessionFromDatabase(token: string) {
  const sessionDB = await UserInfo({
    access_token: token,
  });

  if (!sessionDB.response.status) {
    return {
      status: sessionDB.response.status,
      message: sessionDB.response.message,
      data: {
        access_token: null,
      },
    };
  }

  return {
    status: true,
    message: "access_token valid",
    data: {
      access_token: token,
    },
  };
}
