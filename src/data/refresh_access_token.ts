"use server";

export default async function RefreshAccessToken(refresh_token: string) {
  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/refresh_access_token`;
    const response = await fetch(base_url, {
      method: "POST",
      cache: "no-store",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });
    const data = await response.json();
    return {
      response: data,
    };
  } catch (error) {
    return {
      response: {
        status: false,
        message: `Gagal menghubungi server ${process.env.NEXT_PUBLIC_SILKA_BASE_URL} (${error})`,
      },
    };
  }
}
