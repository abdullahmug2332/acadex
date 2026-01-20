import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const [rows]: any = await db.query('SELECT * FROM users');
    return NextResponse.json(rows); 
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
