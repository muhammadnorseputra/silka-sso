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

  const parseParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const clientId = parseParam(query?.client_id);
  const clientName = parseParam(query?.client_name);
  const responseType = parseParam(query?.response_type);
  const redirectUri = parseParam(query?.redirect_uri);
  const state = parseParam(query?.state);
  const scope = parseParam(query?.scope);

  const response = await verifyClient(
    clientId as string,
    responseType as string,
    redirectUri as string,
    state as string,
    clientName,
  );

  /**
   *
   * ? Jika sudah login dan memiliki access token auto redirect ke client
   *
   */

  // Ensure the response is a plain object

  // clientName optional — don't unauthorized when missing
  if (!response.status && clientName) {
    unauthorized();
  }

  const cookiestore = await cookies();
  
  // Izin Akses
  const consentCookie = cookiestore.get("sso_consent");
  
  if (consentCookie?.value) {
    const consent = JSON.parse(consentCookie.value);
    if(clientId === consent.client_id && redirectUri === consent.redirect_uri)
    {
      return permanentRedirect(`/oauth/sso/izin-access?state=${state}`);
    }
  }
  
  // Izin Layar
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
    const clientNameParam = clientName ? `client_name=${clientName}&` : "";
    permanentRedirect(
      `/#oauth/sso/authorize?${clientNameParam}client_id=${clientId}&redirect_uri=${encodeURIComponent(
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
