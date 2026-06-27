"use server";

import { AES, enc } from "crypto-js";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const CLIENT_APP = [
  {
    client_id: "client-app-1",
    client_name: "Client App 1",
    logoutUri: "http://localhost:4000/api/oauth/backchannel-logout",
  },
];

interface Payload extends JwtPayload {
  data: any;
}

const LOGOUT_SECRET_KEY = process.env.NEXT_PUBLIC_LOGOUT_SECRET_KEY as string;

function getAccessTokenFromCookie(encryptedToken: string): Payload | undefined {
  try {
    const decrypted = AES.decrypt(
      encryptedToken,
      process.env.KEY_PASSPHRASE as string,
    ).toString(enc.Utf8);
    return jwtDecode<Payload>(decrypted);
  } catch (error) {
    console.error("Error decrypting token:", error);
    return undefined;
  }
}

function verifyLogoutToken(token: string): Payload | undefined {
  try {
    return jwt.verify(token, LOGOUT_SECRET_KEY, {
      algorithms: ["HS256"],
    }) as Payload;
  } catch (error) {
    console.error("Error verifying logout_token:", error);
    return undefined;
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const accessTokenCookie = cookieStore.get("sso_token");
  const { logout_token } = await request.json();

  // logout_token adalah JWT yang ditandatangani, beda dengan cookie sso_token (AES encrypted)
  let token: Payload | undefined;

  if (accessTokenCookie?.value) {
    // Dari cookie sesi lokal — AES decrypt dulu baru JWT decode
    token = getAccessTokenFromCookie(accessTokenCookie.value);
  } else if (logout_token) {
    // Dari backchannel logout token — JWT yang sudah ditandatangani, langsung verify
    token = verifyLogoutToken(logout_token);
  }

  if (!token) {
    return NextResponse.json(
      {
        status: false,
        message: "Sudah tidak dalam sesi",
      },
      { status: 401 },
    );
  }
  const { nip } = token.data;

  // lanjutkan validasi / proses token di sini
  const payloadLogout = {
    sub: nip,
    aud: CLIENT_APP.map((app) => app.client_id),
    iat: Math.floor(Date.now() / 1000),
  };
  const jwtLogout = jwt.sign(payloadLogout, LOGOUT_SECRET_KEY, {
    algorithm: "HS256",
  });

  //Broadcast ke semua aplikasi klien secara paralel (Backchannel)
  const logoutPromises = CLIENT_APP.map(async (app) => {
    try {
      await fetch(app.logoutUri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logout_token: jwtLogout }),
        // Set timeout pendek agar jika salah satu aplikasi down, tidak memblokir yang lain
        signal: AbortSignal.timeout(500),
      });
    } catch (error) {
      console.error(`Gagal logout ke ${app.client_name}:`, error);
    }
  });

  await Promise.all(logoutPromises);
  // 4. Hapus cookie sesi utama Next.js SSO
  const response = NextResponse.json({
    status: true,
    message: "SSO pusat telah logout, semua aplikasi klien telah diberitahu.",
  });
  response.cookies.delete("sso_token");
  response.cookies.delete("sso_code");
  response.cookies.delete("sso_state");
  return response;
}
