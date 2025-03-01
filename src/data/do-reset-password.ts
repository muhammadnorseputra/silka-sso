"use server";

import { cookies } from "next/headers";

export async function doResetPassword(FormFileds: any) {
  try {
    const reqbody = {
      new_password: FormFileds.new_password,
      type: FormFileds.type,
      otp: FormFileds.otp,
    };
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/do-reset`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
          "Content-Type": "application/json",
          Authorization: `Bearer ${FormFileds.access_token}`,
        },
        body: JSON.stringify(reqbody),
      }
    );

    const result = await req.json();
    if (result.status) {
      (await cookies()).delete("otp_state");
      (await cookies()).delete("otp_access_token");
    }
    return result;
  } catch (err) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} (${err})`,
    };
  }
}
