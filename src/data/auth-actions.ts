"use server";

import { cookies } from "next/headers";
import { AES } from "crypto-js";
import AccessToken from "./access_token";
// import GetDevicesInfo from "./get-devices-info";

async function CaptchaVerify(token: string) {
  const url = `https://www.google.com/recaptcha/api/siteverify`;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return {
      status: false,
      message:
        "Token captcha tidak ditemukan, pastikan Anda telah menyelesaikan captcha.",
    };
  }

  if (!secret) {
    return {
      status: false,
      message: "RECAPTCHA_SECRET_KEY belum dikonfigurasi di server.",
    };
  }

  try {
    const req = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret}&response=${token}`,
    });

    const result = await req.json();

    if (!result.success) {
      return {
        status: false,
        message: "Verifikasi captcha gagal.",
        error_codes: result["error-codes"],
      };
    }

    return result;
  } catch (error) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${url} error: ${error}`,
    };
  }
}

// Verifikasi reCAPTCHA v2 (checkbox) — dipakai sebagai challenge saat skor v3 rendah
async function CaptchaV2Verify(token: string) {
  const url = `https://www.google.com/recaptcha/api/siteverify`;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return { success: false };
  }
  if (!secret) {
    return { success: false };
  }

  try {
    const req = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`,
    });
    const result = await req.json();
    return { success: Boolean(result.success) };
  } catch {
    return { success: false };
  }
}

export default async function AuthVerify(formData: any) {
  const cookieStore = await cookies();

  // --- Jika client mengirim captcha_v2_token, verifikasi v2 (checkbox) lalu lanjut ---
  if (formData.captcha_v2_token) {
    const v2 = await CaptchaV2Verify(formData.captcha_v2_token);
    if (!v2.success) {
      return {
        response: {
          status: false,
          message: "Verifikasi keamanan gagal. Silakan coba lagi.",
        },
      };
    }
    // v2 lolos → langsung proses login tanpa cek v3
  } else {
    // --- Verifikasi v3 (invisible / score-based) ---
    const captchaResult = await CaptchaVerify(formData.token);

    // Error jaringan / token kosong / secret belum diset
    if (captchaResult.status === false) {
      return { response: captchaResult };
    }

    // Skor v3 rendah → minta checkbox v2 sebagai challenge
    if (captchaResult.score < 0.5) {
      return {
        response: {
          status: false,
          requires_captcha: true,
          message: "Kami mendeteksi aktivitas mencurigakan. Selesaikan verifikasi keamanan untuk melanjutkan.",
        },
      };
    }
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
      client_id: formData.client_id || "5aa888ec-92be-4fdf-8c69-8c96e99e11ff",
      client_secret:
        formData.client_secret ||
        "+51jett5h))zpfhvwhej*r8_0%nej9ljx=*df0_b&2ss3wix*p",
      redirect_uri: formData.redirect_uri,
      state: formData.state,
      scope: formData.scope,
      // device_id: device_id,
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

    // jika login berhasil dan tidak perlu izin akses, maka langsung buat access token
    if (data.status && data.data.is_consent === false && data.data.code) {
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
          maxAge: 3600,
          ...cookieOptions,
        });

        const tokenEnkripsi = AES.encrypt(
          userinfo.response.access_token,
          process.env.KEY_PASSPHRASE as string,
        );

        cookieStore.set({
          name: "sso_token",
          value: tokenEnkripsi.toString(),
          maxAge: 3600,
          ...cookieOptions,
        });
      }
    }

    // jika login berhasil dan perlu izin akses, maka simpan data response ke cookie untuk digunakan di halaman izin akses
    if (data.status && data.data.is_consent) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
      };

      cookieStore.set({
        name: "sso_consent",
        value: JSON.stringify(data.data),
        maxAge: 3600,
        ...cookieOptions,
      });
      cookieStore.set({
        name: "sso_consent_state",
        value: JSON.stringify(data.data.state),
        maxAge: 3600,
        ...cookieOptions,
      });
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
