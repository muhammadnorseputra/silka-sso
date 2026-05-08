"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function create(type: string, hash: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "type_account",
    value: type || "UMPEG",
    httpOnly: true,
    path: "/",
  });

  redirect(hash ? `/${hash}` : "/login");
}
