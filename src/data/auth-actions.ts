"use server";

import { cookies } from "next/headers";
import { AES } from "crypto-js";
import AccessToken from "./access_token";
// import GetDevicesInfo from "./get-devices-info";

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
  // const { device_id } = await GetDevicesInfo();
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

  // if (!device_id) {
  //   return {
  //     response: {
  //       status: false,
  //       message:
  //         "Device ID tidak ditemukan, pastikan anda telah melakukan pendaftaran perangkat.",
  //     },
  //   };
  // }

  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/login`;

    const account = {
      type: cookieStore.get("type_account")?.value,
      username: formData.username,
      password: formData.password,
      client_id: formData.client_id,
      client_secret: formData.client_secret,
    };

    // ✅ AbortController untuk timeout (koneksi lambat / server tidak merespons)
    const TIMEOUT_MS = 8000; // 8 detik
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(base_url, {
        method: "POST",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
        signal: controller.signal,
      });
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        // ✅ Timeout / koneksi lambat
        if (fetchError.name === "AbortError") {
          return {
            response: {
              status: false,
              message:
                "Server tidak merespons dalam batas waktu yang ditentukan. Coba lagi.",
            },
          };
        }

        // ✅ Server tidak bisa dijangkau (network error dari sisi server)
        if (
          fetchError.message.includes("ECONNREFUSED") || // port ditolak
          fetchError.message.includes("ENOTFOUND") || // DNS gagal / domain tidak ditemukan
          fetchError.message.includes("ECONNRESET") || // koneksi direset paksa
          fetchError.message.includes("ETIMEDOUT") // timeout di level TCP
        ) {
          return {
            response: {
              status: false,
              message: `Server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} tidak dapat dijangkau. Periksa koneksi jaringan server.`,
            },
          };
        }
      }

      // ✅ Fallback error tidak terduga
      return {
        response: {
          status: false,
          message: `Terjadi kesalahan jaringan: ${fetchError instanceof Error ? fetchError.message : fetchError}`,
        },
      };
    } finally {
      clearTimeout(timeoutId); // ✅ Selalu bersihkan timer
    }

    const data = await response.json();

    if (data.status) {
      const userinfo = await AccessToken(data.data.code);

      if (userinfo.response.status) {
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
        };

        const codeEnkripsi = AES.encrypt(
          data.data.code,
          process.env.KEY_PASSPHRASE as string,
        );

        cookieStore.set({
          name: "sso_state",
          value: formData.state,
          maxAge: 60,
          ...cookieOptions,
        });
        cookieStore.set({
          name: "sso_code",
          value: codeEnkripsi.toString(),
          maxAge: 3600 * 12,
          ...cookieOptions,
        });

        const tokenEnkripsi = AES.encrypt(
          userinfo.response.access_token,
          process.env.KEY_PASSPHRASE as string,
        );

        cookieStore.set({
          name: "sso_token",
          value: tokenEnkripsi.toString(),
          maxAge: 3600 * 12,
          ...cookieOptions,
        });
      }
    }

    return { response: data };
  } catch (error) {
    return {
      response: {
        status: false,
        message: `Gagal menghubungi server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} (${error})`,
      },
    };
  }
}
