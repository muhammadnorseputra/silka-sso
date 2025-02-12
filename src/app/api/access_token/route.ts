import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const { code } = await req.json();
  const apiKey = req.headers.get("apikey");

  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_APIKEY) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
  }

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/access_token`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    const result = await response.json();
    const data = {
      status: true,
      message: "Access Token Generated",
      grant_type: "authorization_code",
      access_token: result.access_token,
      token_type: result.token_type,
      expires_in: result.expires_in,
    };
    return NextResponse.json(data, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
