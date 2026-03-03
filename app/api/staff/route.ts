





























// app/api/staff/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Staff } from "@/types/Staff"; 

const DEFAULT_IMAGE = "/avatar.png";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const role = searchParams.get("role") || "";
    const hiredDate = searchParams.get("hired_date") || "";
    const offset = (page - 1) * limit;

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
        searchValue
      );
    }

    // Department filter
    if (department) {
      whereClause += " AND department = ?";
      params.push(department);
    }

    // Role filter
    if (role) {
      whereClause += " AND role = ?";
      params.push(role);
    }

    // Hired date filter
    if (hiredDate) {
      whereClause += " AND DATE(hired_date) = ?";
      params.push(hiredDate);
    }

    // Count total
    const [countRows]: any = await pool.execute(
      `SELECT COUNT(*) as total FROM staff ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // Fetch staff data
    const [rows]: any = await pool.execute(
      `SELECT * FROM staff ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({ staff: rows, total });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

// POST: Create new staff
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
      address,
      department,
      role,
      qualification,
      experience,
      date_of_birth,
      hired_date,
    } = body;

    if (!first_name || !last_name || !email || !cnic || !role) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Insert staff without UID first
    const [insertResult]: any = await pool.execute(
      `INSERT INTO staff
        (first_name, last_name, email, cnic, phone, gender, address, department, role, qualification, experience, date_of_birth, hired_date, status, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        cnic,
        phone || null,
        gender || null,
        address || null,
        department || null,
        role,
        qualification || null,
        experience || null,
        date_of_birth || null,
        hired_date || null,
        "active",
        DEFAULT_IMAGE,
      ]
    );

    const insertId = insertResult.insertId;

    // Generate UID like STF0001
    const uid = "STF" + String(insertId).padStart(4, "0");
    await pool.execute(`UPDATE staff SET uid = ? WHERE id = ?`, [uid, insertId]);

    return NextResponse.json(
      { message: "Staff created successfully", id: insertId, uid },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("DB Error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      if (error.sqlMessage.includes("email")) {
        return NextResponse.json(
          { error: "This email is already registered." },
          { status: 400 }
        );
      }
      if (error.sqlMessage.includes("cnic")) {
        return NextResponse.json(
          { error: "This CNIC is already registered." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}