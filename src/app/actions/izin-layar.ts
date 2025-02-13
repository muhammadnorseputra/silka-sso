"use server";

import { cookies } from "next/headers";
import CodeWithAccesToken from "@/data/code_with_access_token";
import { AES, enc } from "crypto-js";
import { redirect } from "next/navigation";

export async function create(clientId: string, state: string, scope: string) {
  const access_token = (await cookies()).get("sso_token");

  if (access_token) {
    const getAccessToken = AES.decrypt(
      access_token?.value,
      process.env.KEY_PASSPHRASE as string
    );
    const result = await CodeWithAccesToken(
      clientId as string,
      getAccessToken.toString(enc.Utf8)
    );
    if (result.response.status) {
      const redirect_url = result.response.data.redirect_uri;
      redirect(
        `${redirect_url}?state=${state}&scope=${scope}&code=${result.response.data.code}`
      );
    }
    return result.response;
  }
  return {
    status: false,
    message: "Invalid Authorize",
  };
}
