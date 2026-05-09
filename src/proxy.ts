import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getSession from "./hooks/session_server";

export async function proxy(req: NextRequest) {
  // Retrieve the token from the request
  const session = await getSession();
  // const { isBot, browser, device, os } = userAgent(req);
  // const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  // Check if the token exists and has the necessary properties
  if (!session || !session.cookie.name) {
    // Redirect to the homepage if the session is invalid or missing
    return NextResponse.redirect(new URL("/", req.url));
  }

  // console.log(
  //   `User Agent: ${browser.name} | ${device.type}, ${device.model}, ${device.vendor} | ${os.name} (Bot: ${isBot})`,
  // );
  // console.log(`IP Address: ${ip}`);
  // Proceed with the request if the session is valid
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/dashboard", "/users", "/settings"],
};
