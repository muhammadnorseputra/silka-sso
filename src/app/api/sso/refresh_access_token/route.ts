import { AES } from "crypto-js";
import { cookies } from "next/headers";
import RefreshAccessToken from "@/data/refresh_access_token";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("sso_refresh_token")?.value;

  if (!refreshToken) {
    return Response.json(
      { status: false, message: "Refresh token tidak ditemukan" },
      { status: 401 },
    );
  }

  const result = await RefreshAccessToken(refreshToken);
  if (!result.response.status) {
    return Response.json(result.response, { status: 401 });
  }

  const { access_token, refresh_token: newRefreshToken } = result.response;

  const tokenEnkripsi = AES.encrypt(
    access_token,
    process.env.KEY_PASSPHRASE as string,
  );
  cookieStore.set({
    name: "sso_token",
    value: tokenEnkripsi.toString(),
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600,
    secure: process.env.NODE_ENV === "production",
  });

  if (newRefreshToken) {
    cookieStore.set({
      name: "sso_refresh_token",
      value: newRefreshToken,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return Response.json({ status: true, access_token });
}
