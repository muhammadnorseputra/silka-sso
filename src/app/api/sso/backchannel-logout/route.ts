"use server";

import { AES, enc } from "crypto-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_APP = [
  {
    client_id: "client-app-1",
    client_name: "Client App 1",
    logoutUri: "https://localhost:4000/api/sso/backchannel-logout",
  },
];
const LOGOUT_SECRET_KEY =
  process.env.LOGOUT_SECRET_KEY || "super-secret-key-bersama";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("sso_token")?.value; // <-- .value

  console.log("sso_token:", accessToken);
  console.log([...request.headers]);
  if (!accessToken) {
    return NextResponse.json(
      { message: "Sudah tidak dalam sesi" },
      { status: 401 },
    );
  }

  // lanjutkan validasi / proses token di sini
}
