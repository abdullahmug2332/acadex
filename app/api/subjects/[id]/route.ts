import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET single subject
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.execute(
      "SELECT * FROM subjects WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch subject" },
      { status: 500 }
    );
  }
}

// UPDATE subject
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { name, code, description, department_id } = body;

    await db.execute(
      `UPDATE subjects
       SET name=?, code=?, description=?, department_id=?
       WHERE id=?`,
      [name, code, description, department_id, id]
    );

    return NextResponse.json({
      message: "Subject updated successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 }
    );
  }
}

// DELETE permanently
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.execute("DELETE FROM subjects WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Subject deleted permanently",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}

// PATCH → trash / restore
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const type = req.nextUrl.searchParams.get("type");

    if (!type || !["deactivate", "restore"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    const newStatus = type === "deactivate" ? "inactive" : "active";

    await db.execute(
      "UPDATE subjects SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    const message =
      type === "deactivate"
        ? "Subject trashed successfully"
        : "Subject restored successfully";

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json(
      { error: "Failed to update subject status" },
      { status: 500 }
    );
  }
}