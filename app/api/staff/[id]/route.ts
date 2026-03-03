// app/api/staff/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string | Promise<string> } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Staff id is required" }, { status: 400 });
    }

    const [rows]: any = await pool.execute(
      `SELECT id, uid, first_name, last_name, email, cnic, phone, gender,
              address, department, role, qualification, experience,
              DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
              DATE_FORMAT(hired_date, '%Y-%m-%d') AS hired_date,
              status, image, created_at, updated_at
       FROM staff WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    const staff = rows[0];
    return NextResponse.json(staff);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Type query parameter is required" }, { status: 400 });
    }

    // 🔹 Restore staff
    if (type === "restore") {
      const [rows]: any = await pool.execute(
        "SELECT id, status FROM staff WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }

      if (rows[0].status === "active") {
        return NextResponse.json({ message: "Staff is already active" });
      }

      await pool.execute("UPDATE staff SET status = ? WHERE id = ?", ["active", id]);

      return NextResponse.json({ message: "Staff status changed to active" });
    }

    // 🔹 Edit staff
    if (type === "edit") {
      const body = await req.json();

      // Required fields
      const requiredFields = ["first_name", "last_name", "email", "cnic", "role", "hired_date"];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json({ error: `${field} is required` }, { status: 400 });
        }
      }

      const [rows]: any = await pool.execute("SELECT id FROM staff WHERE id = ?", [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Staff not found" }, { status: 404 });
      }

      await pool.execute(
        `UPDATE staff SET
          first_name = ?, 
          last_name = ?, 
          email = ?, 
          cnic = ?, 
          phone = ?, 
          gender = ?, 
          address = ?, 
          department = ?, 
          role = ?, 
          qualification = ?, 
          experience = ?, 
          date_of_birth = ?, 
          hired_date = ?
         WHERE id = ?`,
        [
          body.first_name,
          body.last_name,
          body.email,
          body.cnic,
          body.phone || null,
          body.gender || "male",
          body.address || null,
          body.department || null,
          body.role,
          body.qualification || null,
          body.experience || null,
          body.date_of_birth || null,
          body.hired_date,
          id,
        ]
      );

      return NextResponse.json({ message: "Staff updated successfully" });
    }

    return NextResponse.json({ error: "Invalid type. Use ?type=edit or ?type=restore" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT Staff Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

// DELETE staff (soft and hard delete)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "deactivate" or "delete"

    if (!id || !type) {
      return NextResponse.json({ error: "ID and type are required" }, { status: 400 });
    }

    const [rows]: any = await pool.execute("SELECT id FROM staff WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Soft delete / deactivate
    if (type === "deactivate") {
      await pool.execute("UPDATE staff SET status = ? WHERE id = ?", ["inactive", id]);
      return NextResponse.json({ message: "Staff status changed to inactive" });
    }

    // Hard delete
    if (type === "delete") {
      await pool.execute("DELETE FROM staff WHERE id = ?", [id]);
      return NextResponse.json({ message: "Staff deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid delete type. Must be 'deactivate' or 'delete'" }, { status: 400 });
  } catch (error: any) {
    console.error("DELETE Staff Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

