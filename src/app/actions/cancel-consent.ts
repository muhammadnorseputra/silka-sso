"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function cancelConsent() {
  const cookieStore = await cookies();

  if (cookieStore.has("sso_consent")) {
    cookieStore.delete("sso_consent");
  }

  if (cookieStore.has("sso_consent_error")) {
    cookieStore.delete("sso_consent_error");
  }

  const headerStore = await headers();
  const referer = headerStore.get("referer");

  if (referer && referer.trim().length > 0) {
    redirect(referer);
  }

  redirect("/");
}
