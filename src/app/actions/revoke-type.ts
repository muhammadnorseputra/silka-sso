"use server";

import { cookies } from "next/headers";

export async function destroy() {
  const cookieStore = await cookies();

  cookieStore.delete("sso_type");
}
