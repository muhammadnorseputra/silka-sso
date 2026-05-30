"use server";
import verifyClient from "@/data/verify-client";
import Login from "./login";
import { cookies } from "next/headers";

import IzinLayar from "./izin-layar";
import { permanentRedirect, unauthorized } from "next/navigation";
import { AES, enc } from "crypto-js";

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
  const cookiestore = await cookies();

  if (cookiestore.has("sso_token")) {
    const access_token = AES.decrypt(
      cookiestore.get("sso_token")?.value as string,
      process.env.KEY_PASSPHRASE as string,
    ).toString(enc.Utf8);
    return (
      <IzinLayar
        access_token={access_token}
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
