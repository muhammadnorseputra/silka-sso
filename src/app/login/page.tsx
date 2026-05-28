import { permanentRedirect } from "next/navigation";
import getSession from "@/hooks/session_server";
import Login from "../oauth/sso/authorize/login";
import { AES, enc } from "crypto-js";
import { cookies } from "next/headers";
import { getSessionFromDatabase } from "@/services/session-store";

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{
    readonly [key: string]: string | string[] | undefined;
  }>;
}) {
  const session = await getSession();

  const sessionFromDB = await getSessionFromDatabase(
    session?.token_plain as string,
  );

  const code = (await cookies()).get("sso_code");
  const type_account = (await cookies()).get("type_account");
  const shouldRedirect = true;

  if (!type_account || !type_account?.value) {
    return permanentRedirect("/");
  }

  const query = await searchParams;
  if (code?.name && sessionFromDB.status && query?.redirect_uri) {
    const decode = AES.decrypt(
      code?.value,
      process.env.KEY_PASSPHRASE as string,
    );
    const uri = `${query?.redirect_uri}?code=${decode.toString(enc.Utf8)}`;
    return permanentRedirect(uri);
  }

  if (code?.name && sessionFromDB.status && shouldRedirect) {
    const decode = AES.decrypt(
      code?.value,
      process.env.KEY_PASSPHRASE as string,
    );
    return permanentRedirect(
      `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL}/${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK}?code=${decode}`,
    );
  }

  return <Login typeAccount={type_account.value} />;
}
