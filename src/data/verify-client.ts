"use server";

export default async function verifyClient(
  clientId: string | undefined,
  responseType?: string,
  redirectUri?: string,
  state?: string,
  clientName?: string,
) {
  const url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}`;
  try {
    const clientNameParam = clientName ? `client_name=${clientName}&` : "";
    const req = await fetch(
      `${url}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/authorize?${clientNameParam}client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${state}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        },
      }
    );

    const result = await req.json();
    return result;
  } catch (err) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${url} (${err})`,
    };
  }
}
