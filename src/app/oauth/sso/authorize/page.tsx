"use server";
import verifyClient from "@/data/verify-client";
import Login from "./login";
import { unauthorized } from "next/navigation";
import { cookies } from "next/headers";

import IzinLayar from "./izin-layar";
import { AES, enc } from "crypto-js";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;

  const clientId = query?.client_id;
  const clientName = query?.client_name;
  const responseType = query?.response_type;
  const redirectUri = query?.redirect_uri;
  const state = query?.state;

  const response = await verifyClient(
    clientId as string,
    clientName as string,
    responseType as string,
    redirectUri as string,
    state as string
  );

  // const code = (await cookies()).get("sso_code");
  // const access_token = (await cookies()).get("sso_token");
  // if (access_token?.name && code?.name) {
  //   const getAccessToken = AES.decrypt(
  //     access_token?.value,
  //     process.env.KEY_PASSPHRASE as string
  //   );
  //   const result = await CodeWithAccesToken(
  //     clientId as string,
  //     getAccessToken.toString(enc.Utf8)
  //   );
  //   if (result.response.status) {
  //     return permanentRedirect(
  //       `${result.response.data.redirect_uri}?code=${result.response.data.code}`
  //     );
  //   }
  //   return permanentRedirect(redirectUri as string);
  // }

  // Ensure the response is a plain object

  if (!response.status) {
    unauthorized();
    // retrun json from reseponse
    // return (
    //   <div className="text-center text-red-400 bg-white p-10 rounded-xl">
    //     {response.message}
    //   </div>
    // );
  }

  // Izin Layar
  const code = (await cookies()).get("sso_code");
  const sso_token = (await cookies()).get("sso_token");

  if (sso_token?.name && code?.name) {
    const access_token = AES.decrypt(
      sso_token?.value,
      process.env.KEY_PASSPHRASE as string
    ).toString(enc.Utf8);
    return <IzinLayar access_token={access_token} clientId={clientId} />;
  }

  return <Login client={response} />;
}
