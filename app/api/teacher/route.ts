// app/api/teacher/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Teacher } from "@/types/Teachers";

const DEFAULT_IMAGE = "/avatar.png";

// Get All teachers iwith pagination and filteration
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const hiredDate = searchParams.get("hired_date") || "";
    const offset = (page - 1) * limit;

    // Base query
    let whereClause = "WHERE status = ?";
    let params: any[] = [status];

    if (search) {
      whereClause += `
    AND (
      CONCAT(first_name, ' ', last_name) LIKE ? OR
      first_name LIKE ? OR
      last_name LIKE ? OR
      uid LIKE ? OR
      email LIKE ? OR
      phone LIKE ? OR
      cnic LIKE ?
    )
  `;
      const searchValue = `%${search}%`;
      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue,
      );
    }

    // 🏢 Department filter
    if (department) {
      whereClause += " AND department = ?";
      params.push(department);
    }

    // 📅 Hired date filter
    if (hiredDate) {
      whereClause += " AND DATE(hired_date) = ?";
      params.push(hiredDate);
    }

    // 🧮 Count query
    const [countRows]: any = await pool.execute(
      `SELECT COUNT(*) as total FROM teachers ${whereClause}`,
      params,
    );

    const total = countRows[0].total;

    // 📄 Data query
    const [rows]: any = await pool.execute(
      `SELECT * FROM teachers 
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    const teachers = rows.map((t: any) => ({
      ...t,
      subject_id: t.subject_id ? JSON.parse(t.subject_id) : [],
    }));

    return NextResponse.json({ teachers, total });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}

// Create Teacher
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      first_name,
      last_name,
      email,
      cnic,
      phone,
      gender,
      date_of_birth,
      address,
      department,
      qualification,
      experience,
      hired_date,
      subject_id,
    } = body;
    console.log(body);

    if (!first_name || !last_name || !email || !cnic) {
      return NextResponse.json(
        { error: "Required fields are missinggg" },
        { status: 400 },
      );
    }

    const subjectArray = subject_id
      ? subject_id.split(",").map((s: string) => s.trim())
      : [];

    console.log(subjectArray);

    // Insert without uid first
    const [insertResult]: any = await pool.execute(
      `INSERT INTO teachers
      (first_name, last_name, email, cnic, phone, gender, date_of_birth, address, department, qualification, experience, hired_date, status, subject_id, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`,
      [
        first_name,
        last_name,
        email,
        cnic,
        phone || null,
        gender || null,
        date_of_birth || null,
        address || null,
        department,
        qualification,
        experience || null,
        hired_date,
        "active",
        JSON.stringify(subjectArray),
        DEFAULT_IMAGE,
      ],
    );

    const insertId = insertResult.insertId;

    // Generate TCH0001 format
    const uid = "TCH" + String(insertId).padStart(4, "0");

    await pool.execute(`UPDATE teachers SET uid = ? WHERE id = ?`, [
      uid,
      insertId,
    ]);

    return NextResponse.json(
      {
        message: "Teacher added successfully",
        id: insertId,
        uid,
      },
      { status: 201 },
    );
  } catch (error: any) {
  console.error("DB Error:", error);

  // Handle duplicate entry errors
  if (error.code === "ER_DUP_ENTRY") {
    if (error.sqlMessage.includes("email")) {
      return NextResponse.json(
        { error: "This email is already registered. Please use a different email." },
        { status: 400 }
      );
    } else if (error.sqlMessage.includes("cnic")) {
      return NextResponse.json(
        { error: "This CNIC is already registered. Please use a different CNIC." },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Duplicate entry detected. Please check your input." },
        { status: 400 }
      );
    }
  }

  // Fallback for other errors
  return NextResponse.json(
    { error: "Something went wrong. Please try again later." },
    { status: 500 }
  );
}
}

