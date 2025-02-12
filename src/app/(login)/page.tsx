import { permanentRedirect } from "next/navigation";
import getSession from "../hooks/session_server";
import Login from "../oauth/sso/authorize/login";
import { AES, enc } from "crypto-js";
import { cookies } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const code = (await cookies()).get("sso_code");
  const query = await searchParams;
  if (code?.name && session?.cookie.name && query?.redirect_uri) {
    const decode = AES.decrypt(
      code?.value,
      process.env.KEY_PASSPHRASE as string
    );
    const uri = `${query?.redirect_uri}?code=${decode.toString(enc.Utf8)}`;
    return permanentRedirect(uri);
  }

  if (code?.name && session?.cookie.name) {
    return permanentRedirect("/dashboard");
  }

  return <Login />;
}
