"use server";

import { cookies } from "next/headers";
import RevokeToken from "@/data/revoke_token";

export async function logout(
  userId: string,
  clientId: string,
  access_token: string,
  parameter: string,
) {
  try {
    const cookieStore = await cookies();

    if (cookieStore.has("sso_token")) {
      cookieStore.delete("sso_token");
      cookieStore.delete("sso_code");
    }
    const revoke = await RevokeToken(userId, access_token);
    // if (revoke) {
    //   permanentRedirect(parameter);
    // }

    if (!revoke) {
      return {
        status: false,
        message: "Gagal logout, proses server gagal",
        callback: null,
      };
    }

    return {
      status: true,
      message: "Logout Berhasil",
      callback: parameter
    };
  } catch (err) {
    return {
        status: false,
        message: `Gagal koneksi ke server ${err} !`,
        callback: null,
      };
  }
}
