import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET subjects (pagination + search + status)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "active";

    const offset = (page - 1) * limit;

    const [subjects] = await db.execute(
      `SELECT * FROM subjects
       WHERE status = ?
       AND (name LIKE ? OR code LIKE ? OR description LIKE ?)
       LIMIT ? OFFSET ?`,
      [status, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset]
    );

    const [count]: any = await db.execute(
      `SELECT COUNT(*) as total
       FROM subjects
       WHERE status = ?
       AND (name LIKE ? OR code LIKE ? OR description LIKE ?)
       ORDER BY id DESC`,
      [status, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    return NextResponse.json({
      subjects,
      total: count[0].total,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

// CREATE subject
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, description, department_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Subject code is required" },
        { status: 400 }
      );
    }

    await db.execute(
      `INSERT INTO subjects (name, code, description, department_id)
       VALUES (?, ?, ?, ?)`,
      [name, code, description, department_id]
    );

    return NextResponse.json({
      message: "Subject created successfully",
    });

  } catch (error: any) {

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Subject code already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}