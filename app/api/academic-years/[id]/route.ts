import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET SINGLE ACADEMIC YEAR
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Use DATE_FORMAT to return YYYY-MM-DD as string
    const [rows]: any = await db.execute(
      "SELECT id, name, DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date, status,  DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at FROM academic_years WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Academic year not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch academic year" },
      { status: 500 }
    );
  }
}






// UPDATE ACADEMIC YEAR
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, start_date, end_date } = await req.json();

    await db.execute(
      `UPDATE academic_years
       SET name = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
      [name, start_date, end_date, id]
    );

    return NextResponse.json({
      message: "Academic year updated successfully",
    });

  } catch (error: any) {

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Academic year already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update academic year" },
      { status: 500 }
    );
  }
}






// DEACTIVATE / RESTORE
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    if (!type || !["deactivate", "restore"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    const isDeactivate = type === "deactivate";
    const newStatus = isDeactivate ? "inactive" : "active";

    await db.execute(
      "UPDATE academic_years SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return NextResponse.json({
      message: isDeactivate
        ? "Academic year trashed successfully"
        : "Academic year restored successfully",
    });

  } catch {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}






// PERMANENT DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    await db.execute(
      "DELETE FROM academic_years WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Academic year permanently deleted",
    });

  } catch {

    return NextResponse.json(
      { error: "Failed to delete academic year" },
      { status: 500 }
    );
  }
}