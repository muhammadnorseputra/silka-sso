import QRCode from "qrcode";
import speakeasy from "speakeasy";

export async function GET() {
  const secret = speakeasy.generateSecret({
    name: process.env.MFA_KEY,
  });

  if (!secret.otpauth_url) {
    return Response.json({
      error: "Failed to generate OTP auth URL",
      status: 500,
    });
  }

  const data = await QRCode.toDataURL(secret.otpauth_url);

  return Response.json({ data, secret: secret.base32, status: 200 });
}
