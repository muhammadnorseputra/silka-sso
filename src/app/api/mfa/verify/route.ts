import { getSessionFromDatabase } from "@/services/session-store";
import speakeasy from "speakeasy";

export async function POST(req, res) {
  const { secret, token, access_token } = await req.json();

  const session = await getSessionFromDatabase(access_token);

  // Here, we have to implement 2 strategies
  // 1. Verifying during LOGIN
  // 2. Enabling 2FA for the first time

  // 1. Verifying during LOGIN
  if (!session) {
    // Have a function to decrypt your secret key
    const verified = speakeasy.totp.verify({
      secret: secret, // Secret Key
      encoding: "base32",
      token: token, // OTP Code
    });

    return Response.json({ verified });
  }

  // 2. Enabling 2FA for the first time
  const verified = speakeasy.totp.verify({
    secret: secret, // Secret Key
    encoding: "base32",
    token: token, // OTP Code
  });

  if (verified) {
    // save the secret in your database
    // Don't forget to encrypt it
    console.log("verify_mfa_to_database");
  }

  return Response.json({ verified });
}
