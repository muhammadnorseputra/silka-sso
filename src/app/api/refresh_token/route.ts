import { NextResponse } from "next/server";

export async function PUT(req: Request): Promise<NextResponse> {
  const { refresh_token } = await req.json();
  const apiKey = req.headers.get("apikey");

  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_APIKEY) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
  }

  if (!refresh_token) {
    return NextResponse.json(
      { error: "Refresh token is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/refresh_access_token`,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      }
    );

    const result = await response.json();
    const data = {
      status: true,
      message: "New Access Token Generated",
      grant_type: "new_access_token",
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
