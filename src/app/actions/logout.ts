"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import RevokeTokenClient from "@/data/revoke_token_client";

export async function logout(
  userId: string,
  clientId: string,
  access_token: string,
  parameter: string
) {
  const cookieStore = await cookies();

  if (cookieStore.has("sso_token")) {
    cookieStore.delete("sso_token");
    cookieStore.delete("sso_code");
  }
  const revoke = await RevokeTokenClient(userId, clientId, access_token);
  if (revoke) {
    permanentRedirect(parameter);
  }
}
