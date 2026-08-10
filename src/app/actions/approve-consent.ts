"use server";

import { cookies } from "next/headers";

interface ConsentPayload {
  client_id?: string;
  scope?: string;
  redirect_uri?: string;
  state?: string;
  nip?: string;
  username?: string;
  level?: string;
}

interface ConsentApiResponse {
  code?: string;
  message?: string;
  error?: string;
  data?: {
    code?: string;
    redirect_uri?: string;
  };
}

export type ConsentApprovalResult = {
  success: boolean;
  redirectUri?: string;
  error?: string;
};

export async function approveConsent(
  formData: FormData,
): Promise<ConsentApprovalResult> {
  const latestState = formData.get("state")?.toString() || "";
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("sso_consent");

  let consent: ConsentPayload | null = null;

  if (consentCookie?.value) {
    try {
      consent = JSON.parse(consentCookie.value) as ConsentPayload;
    } catch {
      cookieStore.set("sso_consent_error", "Data izin akses tidak valid.", {
        path: "/",
        sameSite: "lax",
      });

      return {
        success: false,
        error: "Data izin akses tidak valid.",
      };
    }
  } else {
    consent = {
      client_id: formData.get("client_id")?.toString() || undefined,
      scope: formData.get("scope")?.toString() || undefined,
      redirect_uri: formData.get("redirect_uri")?.toString() || undefined,
      state: formData.get("state")?.toString() || undefined,
      nip: formData.get("nip")?.toString() || undefined,
      username: formData.get("username")?.toString() || undefined,
      level: formData.get("level")?.toString() || undefined,
    };
  }

  const payload = {
    response_type: "authorization_code",
    client_id: consent?.client_id || "",
    scope: consent?.scope,
    redirect_uri: consent?.redirect_uri || "",
    state: latestState || consent?.state || "",
    nip: consent?.nip || "",
    username: consent?.username || "",
    level: consent?.level || "",
  };

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/authorize`;

    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as ConsentApiResponse;

    if (!response.ok) {
      const errorMessage =
        body?.message || "Gagal mengirim izin akses ke layanan SSO.";

      cookieStore.set("sso_consent_error", errorMessage, {
        path: "/",
        sameSite: "lax",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }

    const code = body?.data?.code;

    if (!code) {
      const errorMessage =
        "Layanan SSO tidak mengembalikan authorization code.";

      cookieStore.set("sso_consent_error", errorMessage, {
        path: "/",
        sameSite: "lax",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }

    if (cookieStore.has("sso_consent_error")) {
      cookieStore.delete("sso_consent_error");
    }

    const redirectBase =
      body?.data?.redirect_uri || consent?.redirect_uri || "";

    const cleanState = (latestState || consent?.state || "").replace(
      /^"+|"+$/g,
      "",
    );

    const redirectUri = redirectBase
      ? `${redirectBase}${redirectBase.includes("?") ? "&" : "?"}state=${cleanState}&code=${code}`
      : "";

    return {
      success: true,
      redirectUri,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message || "Terjadi kesalahan saat mengirim izin akses."
        : "Terjadi kesalahan saat mengirim izin akses.";

    cookieStore.set("sso_consent_error", errorMessage, {
      path: "/",
      sameSite: "lax",
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}
