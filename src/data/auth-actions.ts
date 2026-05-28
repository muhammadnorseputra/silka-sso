"use server";

import { cookies } from "next/headers";
import { AES } from "crypto-js";
import AccessToken from "./access_token";
import GetDevicesInfo from "./get-devices-info";

async function CaptchaVerify(token: string) {
  const url = `https://www.google.com/recaptcha/api/siteverify`;

  if (!token) {
    return {
      status: false,
      message:
        "Token captcha tidak ditemukan, pastikan Anda telah menyelesaikan captcha.",
    };
  }

  try {
    const req = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const result = await req.json();
    return result;
  } catch (error) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${url} error: ${error}`,
    };
  }
}

export default async function AuthVerify(formData: any) {
  const cookieStore = await cookies();
  const { device_id } = await GetDevicesInfo();
  const captchaResult = await CaptchaVerify(formData.token);

  if (!captchaResult.success && captchaResult.score < 0.5) {
    return {
      response: {
        status: false,
        message:
          "Verifikasi captcha gagal, pastikan Anda telah menyelesaikan captcha dengan benar.",
      },
    };
  }

  if (!device_id) {
    return {
      response: {
        status: false,
        message:
          "Device ID tidak ditemukan, pastikan anda telah melakukan pendaftaran perangkat.",
      },
    };
  }

  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/login`;

    const account = {
      type: cookieStore.get("type_account")?.value,
      username: formData.username,
      password: formData.password,
      client_id: formData.client_id,
      client_secret: formData.client_secret,
      device_id,
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
          maxAge: 60,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
        });

        /**
         * AUTH CODE
         */
        cookieStore.set({
          name: "sso_code",
          value: codeEnkripsi.toString(),
          httpOnly: true,
          maxAge: 3600,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
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
          maxAge: 3600,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
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
