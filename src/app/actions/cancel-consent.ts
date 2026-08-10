"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function cancelConsent(formData: FormData) {
  const cookieStore = await cookies();

  if (cookieStore.has("sso_consent")) {
    cookieStore.delete("sso_consent");
  }

  if (cookieStore.has("sso_consent_error")) {
    cookieStore.delete("sso_consent_error");
  }

  const fallbackRedirectUri = formData.get("redirect_uri")?.toString() || "";

  const headerStore = await headers();
  const referer = headerStore.get("referer");

  if (referer && referer.trim().length > 0) {
    redirect(referer);
  }

  if (fallbackRedirectUri) {
    const separator = fallbackRedirectUri.includes("?") ? "&" : "?";
    redirect(
      `${fallbackRedirectUri}${separator}error=access_denied&error_description=${encodeURIComponent("Pengguna membatalkan izin akses.")}`,
    );
  }

  redirect("/");
}
