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
  const cookiestore = await cookies();

  const sessionFromDB = await getSessionFromDatabase(
    session?.token_plain as string,
  );

  const code = cookiestore.get("sso_code");

  const type_account = cookiestore.get("type_account");
  const shouldRedirect = true;

  if (!type_account || !type_account?.value) {
    return permanentRedirect("/");
  }

  const query = await searchParams;
  const redirectTo =
    query?.redirect_uri ||
    `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL}${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK}`;

  if (cookiestore.has("sso_code") && !sessionFromDB.status) {
    return permanentRedirect(
      `https://silka-sso.vercel.app/oauth/sso/authorize?client_id=5aa888ec-92be-4fdf-8c69-8c96e99e11ff&client_name=PortalSSO&response_type=code&redirect_uri=${redirectTo}`,
    );
  }

  if (cookiestore.has("sso_code") && sessionFromDB.status && redirectTo) {
    const decode = AES.decrypt(
      code?.value as string,
      process.env.KEY_PASSPHRASE as string,
    );
    const uri = `${redirectTo}?code=${decode.toString(enc.Utf8)}`;
    return permanentRedirect(uri);
  }

  if (cookiestore.has("sso_code") && sessionFromDB.status && shouldRedirect) {
    const decode = AES.decrypt(
      code?.value as string,
      process.env.KEY_PASSPHRASE as string,
    );
    return permanentRedirect(
      `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL}/${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK}?code=${decode}`,
    );
  }

  return <Login typeAccount={type_account.value} client={undefined} scope={""} />;
}
