








import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string | Promise<string> } },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Teacher id is required" },
        { status: 400 },
      );
    }

    const [rows]: any = await pool.execute(
      "SELECT id, uid,first_name, last_name, email, cnic , phone, gender, DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,address, department, qualification, experience, DATE_FORMAT(hired_date, '%Y-%m-%d') AS hired_date,status, image, subject_id,created_at, updated_at FROM teachers WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const teacher = rows[0];
    console.log("from server ",teacher)

    // Parse subject_id JSON
    teacher.subject_id = teacher.subject_id
      ? JSON.parse(teacher.subject_id)
      : [];

    return NextResponse.json(teacher);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Type query parameter is required" },
        { status: 400 }
      );
    }

    // 🔹 Restore teacher
    if (type === "restore") {
      const [rows]: any = await pool.execute(
        "SELECT id, status FROM teachers WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }

      const teacher = rows[0];
      if (teacher.status === "active") {
        return NextResponse.json({ message: "Teacher is already active" });
      }

      await pool.execute("UPDATE teachers SET status = ? WHERE id = ?", ["active", id]);

      return NextResponse.json({ message: "Teacher status changed to active" });
    }

    // 🔹 Edit teacher
    if (type === "edit") {
      const body = await req.json();

      // Validate required fields
      const requiredFields = ["first_name", "last_name", "email", "hired_date"];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json({ error: `${field} is required` }, { status: 400 });
        }
      }

      const [rows]: any = await pool.execute(
        "SELECT id FROM teachers WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }

      const subjectIdStr = body.subject_id ? JSON.stringify(body.subject_id) : "[]";

      await pool.execute(
        `UPDATE teachers SET
          first_name = ?, 
          last_name = ?, 
          email = ?, 
          cnic = ?, 
          phone = ?, 
          gender = ?, 
          date_of_birth = ?, 
          address = ?, 
          department = ?, 
          qualification = ?, 
          experience = ?, 
          hired_date = ?, 
          subject_id = ?
        WHERE id = ?`,
        [
          body.first_name,
          body.last_name,
          body.email,
          body.cnic,
          body.phone || null,
          body.gender || "male",
          body.date_of_birth || null,
          body.address || null,
          body.department || null,
          body.qualification || null,
          body.experience || null,
          body.hired_date,
          subjectIdStr,
          id,
        ]
      );

      return NextResponse.json({ message: "Teacher updated successfully" });
    }

    return NextResponse.json(
      { error: "Invalid type. Use ?type=edit or ?type=restore" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PUT Teacher Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// Deactivate or delete the user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // still use type query

    if (!id || !type) {
      return NextResponse.json(
        { error: "ID and type are required" },
        { status: 400 },
      );
    }

    // Check if teacher exists
    const [rows]: any = await pool.execute(
      "SELECT id FROM teachers WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // 🔹 Soft delete (deactivate)
    if (type === "deactivate") {
      await pool.execute("UPDATE teachers SET status = ? WHERE id = ?", [
        "inactive",
        id,
      ]);

      return NextResponse.json({
        message: "Teacher status changed to inactive",
      });
    }

    // 🔹 Hard delete
    if (type === "delete") {
      await pool.execute("DELETE FROM teachers WHERE id = ?", [id]);

      return NextResponse.json({
        message: "Teacher deleted successfully",
      });
    }

    // Invalid type
    return NextResponse.json(
      { error: "Invalid delete type. Must be 'deactivate' or 'delete'" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("DELETE Teacher Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
