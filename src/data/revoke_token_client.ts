"use server";

export default async function RevokeTokenClient(
  uid: string,
  client_id: string,
  access_token: string
) {
  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/revoke_token_client?user_id=${uid}&client_id=${client_id}`;
    const response = await fetch(base_url, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
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
