import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    // 1️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    // 2️⃣ Fetch user from DB by ID
    const [rows]: any = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.id]
    );

    const user = rows[0];

    // 3️⃣ If user not found
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // 4️⃣ Return user (without password)
    return NextResponse.json({ user });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
