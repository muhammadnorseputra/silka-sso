"use server";
import verifyClient from "@/data/verify-client";
import Login from "./login";
import { cookies } from "next/headers";

import IzinLayar from "./izin-layar";
// import { AES, enc } from "crypto-js";
import { permanentRedirect, unauthorized } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{
    readonly [key: string]: string | string[] | undefined;
  }>;
}) {
  const query = await searchParams;

  const clientId = query?.client_id;
  const clientName = query?.client_name;
  const responseType = query?.response_type;
  const redirectUri = query?.redirect_uri;
  const state = query?.state;
  const scope = query?.scope;

  const response = await verifyClient(
    clientId as string,
    clientName as string,
    responseType as string,
    redirectUri as string,
    state as string,
  );

  /**
   *
   * ? Jika sudah login dan memiliki access token auto redirect ke client
   *
   */

  // Ensure the response is a plain object

  if (!response.status) {
    unauthorized();
  }

  // Izin Layar
  const code = (await cookies()).get("sso_code");
  const code_plain = (await cookies()).get("sso_code_plain");
  const sso_token = (await cookies()).get("sso_token");
  const sso_token_plain = (await cookies()).get("sso_token_plain");

  if (sso_token_plain?.name && code_plain?.name) {
    // const access_token = AES.decrypt(
    //   sso_token?.value,
    //   process.env.KEY_PASSPHRASE as string,
    // ).toString(enc.Utf8);
    return (
      <IzinLayar
        access_token={sso_token_plain}
        state={state}
        scope={scope}
        clientId={clientId}
        redirectUri={redirectUri as string}
      />
    );
  }

  // Type Account Check
  const typeAccount = (await cookies()).get("type_account");
  if (!typeAccount || typeAccount.value === "undefined") {
    permanentRedirect(
      `/#oauth/sso/authorize?client_name=${clientName}&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri as string,
      )}&response_type=code&scope=${scope}&state=${state}`,
    );
  }

  return (
    <Login
      client={response}
      state={state}
      scope={scope}
      redirectUri={redirectUri as string}
      typeAccount={typeAccount.value}
    />
  );
}
