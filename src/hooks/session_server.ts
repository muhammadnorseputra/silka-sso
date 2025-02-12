import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AES, enc } from "crypto-js";

export default async function getSession() {
  const getCookie = cookies();

  const cookie = (await getCookie).get("sso_token");
  if (cookie?.name && cookie.value) {
    const tokenDycript = AES.decrypt(
      cookie.value,
      process.env.KEY_PASSPHRASE as string
    ).toString(enc.Utf8);
    const decoded = jwtDecode<JwtPayload>(tokenDycript);
    return {
      cookie,
      decoded,
    };
  }
}
