"use server";

import { cookies, headers } from "next/headers";
import AccessToken from "./access_token";
import { AES } from "crypto-js";
import { userAgent } from "next/server";

export default async function AuthVerify(formData: any) {
  const cookieStore = await cookies();
  const headersList = await headers();

  /**
   * Get IP Address
   * Support:
   * - Vercel
   * - Nginx
   * - Cloudflare
   * - Localhost
   */
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  const ip =
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(",")[0]?.trim() ||
    "127.0.0.1";

  /**
   * Get User Agent
   */
  const ua = headersList.get("user-agent") || "";

  const { isBot, browser, device, os } = userAgent({
    headers: {
      get(name: string) {
        return headersList.get(name);
      },
    },
  } as any);

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
      console.log("========== USER INFO ==========");
      console.log(`IP Address : ${ip}`);
      console.log(`User Agent : ${ua}`);
      console.log(`Browser    : ${browser.name}`);
      console.log(`Device     : ${device.type || "desktop"}`);
      console.log(`Model      : ${device.model || "-"}`);
      console.log(`Vendor     : ${device.vendor || "-"}`);
      console.log(`OS         : ${os.name}`);
      console.log(`Bot        : ${isBot}`);
      console.log("================================");

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
          secure: process.env.NODE_ENV === "production",
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
          secure: process.env.NODE_ENV === "production",
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
          secure: process.env.NODE_ENV === "production",
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
