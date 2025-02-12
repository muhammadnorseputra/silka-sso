"use server";

export default async function verifyClient(
  clientId: string | undefined,
  clientName: string | undefined,
  responseType: string | undefined,
  redirectUri: string | undefined,
  state: string | undefined
) {
  const url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}`;
  try {
    const req = await fetch(
      `${url}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/authorize?client_name=${clientName}&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${state}`,
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
