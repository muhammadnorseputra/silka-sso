"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function cekMailOTP(FormFileds: any) {
  const cookieStore = await cookies();
  try {
    const reqbody = {
      type: FormFileds.type,
      email: FormFileds.email,
    };
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/reset-password`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqbody),
      }
    );

    const result = await req.json();

    if (result.status) {
      const state = uuidv4();
      // make state
      cookieStore.set({
        name: "otp_state",
        value: state,
        httpOnly: true,
        maxAge: 600,
        secure: process.env.NODE_ENV === "production",
      });
      cookieStore.set({
        name: "otp_access_token",
        value: result.access_token,
        httpOnly: true,
        maxAge: 600,
        secure: process.env.NODE_ENV === "production",
      });
      return {
        status: true,
        message: result.message,
        state,
        result,
      };
    }
    return result;
  } catch (err) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} (${err})`,
    };
  }
}
