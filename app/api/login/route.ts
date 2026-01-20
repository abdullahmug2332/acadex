import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  // 1️⃣ Find user
  const [rows]: any = await pool.query(
    "SELECT id, name, email, password FROM users WHERE email=?",
    [email]
  );

  const user = rows[0];

  if (!user) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  // 2️⃣ Check password (⚠️ hashing recommended)
  if (user.password !== password) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // 3️⃣ Generate JWT
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: "1h" }
  );

  // 4️⃣ Remove password BEFORE sending user
  const { password: _, ...safeUser } = user;

  // 5️⃣ Send response
  const res = NextResponse.json({
    message: "Login successful",
    user: safeUser, 
  });

  // 6️⃣ Set httpOnly cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res;
}
