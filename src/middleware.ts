import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getSession from "./hooks/session_server";

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request
  const session = await getSession();
  // Check if the token exists and has the necessary properties
  if (!session || !session.cookie.name) {
    // Redirect to the homepage if the session is invalid or missing
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Proceed with the request if the session is valid
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/dashboard", "/users", "/settings"],
};
