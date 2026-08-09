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
    message?: string;
  };
  response?: {
    data?: {
      code?: string;
      message?: string;
    };
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
  void formData;
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("sso_consent");

  if (!consentCookie?.value) {
    cookieStore.set("sso_consent_error", "Sesi izin akses tidak ditemukan.", {
      path: "/",
      sameSite: "lax",
    });

    return {
      success: false,
      error: "Sesi izin akses tidak ditemukan.",
    };
  }

  let consent: ConsentPayload | null = null;

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

  const payload = {
    response_type: "authorization_code",
    client_id: consent?.client_id || "",
    scope: consent?.scope,
    redirect_uri: consent?.redirect_uri || "",
    state: consent?.state || "",
    nip: consent?.nip || "",
    username: consent?.username || "",
    level: consent?.level || "",
  };

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}/${process.env.NEXT_PUBLIC_VERSION}/oauth/sso/authorize/consent`;

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
    console.log("Consent API Response:", body);

    if (!response.ok) {
      const errorMessage =
        body?.message ||
        body?.error ||
        body?.data?.message ||
        body?.response?.data?.message ||
        "Gagal mengirim izin akses ke layanan SSO.";

      cookieStore.set("sso_consent_error", errorMessage, {
        path: "/",
        sameSite: "lax",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }

    const code =
      body?.code ||
      body?.data?.code ||
      body?.response?.data?.code;

    if (!code) {
      const errorMessage = "Layanan SSO tidak mengembalikan authorization code.";

      cookieStore.set("sso_consent_error", errorMessage, {
        path: "/",
        sameSite: "lax",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }

    const target = new URL(consent.redirect_uri || "");
    target.searchParams.set("state", consent.state || "");
    target.searchParams.set("code", code);

    if (cookieStore.has("sso_consent")) {
      cookieStore.delete("sso_consent");
    }

    if (cookieStore.has("sso_consent_error")) {
      cookieStore.delete("sso_consent_error");
    }

    return {
      success: true,
      redirectUri: target.toString(),
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
