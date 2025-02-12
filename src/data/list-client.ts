"use server";

export default async function ListClients() {
  try {
    const base_url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/clients?is_private=N`;
    const response = await fetch(base_url, {
      method: "GET",
      cache: "no-store",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return {
      result,
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
