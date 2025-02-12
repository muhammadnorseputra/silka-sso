"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import RevokeToken from "@/data/revoke_token";
import { AES, enc } from "crypto-js";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface Payload extends JwtPayload {
  data: any;
}

export async function RevokeAccess() {
  const cookieStore = await cookies();

  // access_token
  const accessToken = cookieStore.get("sso_token");
  const getToken = AES.decrypt(
    accessToken?.value as string,
    process.env.KEY_PASSPHRASE as string
  ).toString(enc.Utf8);
  const access_token_decode = jwtDecode<Payload>(getToken);
  const { nip } = access_token_decode.data;

  const revoke = await RevokeToken(nip, getToken);
  if (revoke.response.status === false) {
    cookieStore.delete("sso_token");
    cookieStore.delete("sso_code");
    permanentRedirect("/");
  }
}
