import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET single department
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.execute(
      "SELECT * FROM departments WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch department" },
      { status: 500 },
    );
  }
}

// EDIT DEPARTMENT
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { name, description, head_id } = await req.json();

    await db.execute(
      "UPDATE departments SET name = ?, description = ?, head_id=?  WHERE id = ?",
      [name, description || null, head_id, id],
    );

    return NextResponse.json({
      message: "Department updated successfully",
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Department name already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 },
    );
  }
}

// DEACTIVATE / RESTORE
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");

    if (!type || !["deactivate", "restore"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const isDeactivate = type === "deactivate";
    const newStatus = isDeactivate ? "inactive" : "active";

    await db.execute(
      "UPDATE departments SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return NextResponse.json({
      message: isDeactivate
        ? "Department trashed successfully"
        : "Department restored successfully",
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await db.execute("DELETE FROM departments WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Department permanently deleted",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 },
    );
  }
}
