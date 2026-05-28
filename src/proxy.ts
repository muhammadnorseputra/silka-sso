import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getSession from "./hooks/session_server";
import { getSessionFromDatabase } from "./services/session-store";

export async function proxy(req: NextRequest) {
  // Retrieve the token from the request
  const token = await getSession();

  const sessionFromDB = await getSessionFromDatabase(
    token?.token_plain as string,
  );

  console.log(sessionFromDB);
  if (!sessionFromDB) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("sso_token");
    res.cookies.delete("sso_token_plain");
    return res;
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/dashboard", "/users", "/settings"],
};
