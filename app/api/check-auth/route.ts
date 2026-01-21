// app/api/check-auth/route.ts
import { NextResponse } from "next/server";

export async function GET(req: any) {
  const cookie = req.cookies.get("token"); // replace "token" with your cookie name

  if (cookie) {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false });
  }
}