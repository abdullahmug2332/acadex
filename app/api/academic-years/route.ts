import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// CREATE ACADEMIC YEAR
export async function POST(req: NextRequest) {
  try {
    const { name, start_date, end_date, status } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Academic year name is required" },
        { status: 400 }
      );
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    await db.execute(
      `INSERT INTO academic_years (name, start_date, end_date, status)
       VALUES (?, ?, ?, ?)`,
      [name, start_date, end_date, status || "active"]
    );

    return NextResponse.json(
      { message: "Academic year created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Academic year already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// GET ALL ACADEMIC YEARS (Pagination + Search + Status + Optional Basic List)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const basic = searchParams.get("basic") === "true";

    if (basic) {
      const [years]: any = await db.execute(
        `SELECT id, name, 
                DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date
         FROM academic_years
         WHERE status = 'active'
         ORDER BY name ASC`
      );

      return NextResponse.json({
        academic_years: years,
        total: years.length,
      });
    }

    const offset = (page - 1) * limit;

    let baseQuery = "FROM academic_years WHERE 1=1";
    const values: any[] = [];

    if (search) {
      baseQuery += " AND name LIKE ?";
      values.push(`%${search}%`);
    }

    if (status) {
      baseQuery += " AND status = ?";
      values.push(status);
    }

    // Use DATE_FORMAT for all date fields
    const [data]: any = await db.execute(
      `SELECT id, name, 
              DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
              DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
              status,
              DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
              DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
       ${baseQuery} 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
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
    console.error("GET /academic-years error:", error);

    return NextResponse.json(
      { error: "Failed to fetch academic years" },
      { status: 500 }
    );
  }
}
