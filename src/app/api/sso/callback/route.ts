import AccessToken from "@/data/access_token";
import { AES } from "crypto-js";
import { cookies } from "next/headers";

export async function GET(req: any) {
  const { host, protocol, searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  // const scope = searchParams.get("scope");
  const state = searchParams.get("state");
  const cookieStore = await cookies();

  const fullHost = `${protocol}//${host}`; // Contoh: http://localhost:3000

  if (!code) {
    return Response.json(
      { status: false, message: "Code not provide" },
      { status: 400 }
    );
  }

  if (state !== cookieStore.get("sso_state")?.value) {
    return Response.json(
      { status: false, message: "State not match" },
      { status: 400 }
    );
  }

  const userinfo = await AccessToken(code);
  console.log(userinfo);
  if (userinfo.response.status) {
    const tokenEnkripsi = AES.encrypt(
      userinfo.response.access_token,
      process.env.KEY_PASSPHRASE as string
    );
    // ACCESS TOKEN
    cookieStore.set({
      name: "sso_token",
      value: tokenEnkripsi.toString(),
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600,
      secure: process.env.NODE_ENV === "production",
    });
    return Response.redirect(`${fullHost}/dashboard`, 302);
  }

  return Response.json(userinfo);
}
