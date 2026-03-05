import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


// CREATE DEPARTMENT
export async function POST(req: NextRequest) {
  try {
    const { name, description, head_id } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 },
      );
    }
    if (!head_id) {
      return NextResponse.json(
        { error: "Head id is required" },
        { status: 400 },
      );
    }

    await db.execute(
      "INSERT INTO departments (name, description,head_id) VALUES (?, ?, ?)",
      [name, description || null, head_id],
    );

    return NextResponse.json(
      { message: "Department created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Department name already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}





// GET ALL DEPARTMENTS (Pagination + Search + Status + Optional Basic List)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const basic = searchParams.get("basic") === "true"; // optional flag for minimal data

    if (basic) {
      // Basic list without pagination/search/status
      const [departments]: any = await db.execute(
        `SELECT id, name FROM departments WHERE status='active' ORDER BY name ASC`
      );

      return NextResponse.json({
        departments,
        total: departments.length,
      });
    }

    // Pagination + Search + Status logic
    const offset = (page - 1) * limit;

    let baseQuery = "FROM departments WHERE 1=1";
    const values: any[] = [];

    if (search) {
      baseQuery += " AND (name LIKE ? OR description LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      baseQuery += " AND status = ?";
      values.push(status);
    }

    const [data]: any = await db.execute(
      `SELECT * ${baseQuery} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [count]: any = await db.execute(
      `SELECT COUNT(*) as total ${baseQuery}`,
      values
    );

    return NextResponse.json({
      data,
      total: count[0].total,
      page,
      limit,
    });
  } catch (error) {
    console.error("GET /departments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}