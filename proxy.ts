import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!auth|api|_next|favicon.ico|.*\\..*).*)",
  ],
};