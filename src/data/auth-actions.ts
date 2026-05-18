"use server";

import { cookies } from "next/headers";
import { AES } from "crypto-js";
import AccessToken from "./access_token";

export default async function AuthVerify(formData: any) {
  const cookieStore = await cookies();

  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/login`;

    const account = {
      type: cookieStore.get("type_account")?.value,
      username: formData.username,
      password: formData.password,
      client_id: formData.client_id,
      client_secret: formData.client_secret,
    };

    /**
     * Request Login Endpoint
     */
    const response = await fetch(base_url, {
      method: "POST",
      cache: "no-store",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });

    const data = await response.json();

    if (data.status) {
      const userinfo = await AccessToken(data.data.code);

      if (userinfo.response.status) {
        /**
         * Encrypt Authorization Code
         */
        const codeEnkripsi = AES.encrypt(
          data.data.code,
          process.env.KEY_PASSPHRASE as string,
        );

        /**
         * AUTH STATE
         */
        cookieStore.set({
          name: "sso_state",
          value: formData.state,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60,
          secure: true,
        });

        /**
         * AUTH CODE
         */
        cookieStore.set({
          name: "sso_code",
          value: codeEnkripsi.toString(),
          httpOnly: true,
          sameSite: "lax",
          maxAge: 3600,
          secure: true,
        });

        /**
         * Encrypt Access Token
         */
        const tokenEnkripsi = AES.encrypt(
          userinfo.response.access_token,
          process.env.KEY_PASSPHRASE as string,
        );

        /**
         * ACCESS TOKEN
         */
        cookieStore.set({
          name: "sso_token",
          value: tokenEnkripsi.toString(),
          httpOnly: true,
          sameSite: "lax",
          maxAge: 3600,
          secure: true,
        });
      }
    }

    return {
      response: data,
    };
  } catch (error) {
    return {
      response: {
        status: false,
        message: `Gagal menghubungi server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} (${error})`,
      },
    };
  }
}
