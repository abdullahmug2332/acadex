// types/Staff.ts

export interface Staff {
  id: number;
  uid: string;                  // e.g., STF0001
  first_name: string;
  last_name: string;
  email: string;
  cnic: string;
  phone?: string | null;
  gender?: "male" | "female" | "other" | null;
  address?: string | null;
  department?: string | null;
  role: string;                 // Staff role (Admin, Librarian, etc.)
  qualification?: string | null;
  experience?: string | null;
  date_of_birth?: string | null; // ISO string: YYYY-MM-DD
  hired_date?: string | null;    // ISO string: YYYY-MM-DD
  status: "active" | "inactive";
  image?: string | null;
  created_at: string;           // timestamp string
  updated_at: string;           // timestamp string
}

// Optional type for forms when creating/updating staff
export interface StaffForm {
  first_name: string;
  last_name: string;
  email: string;
  cnic: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  department?: string;
  role: string;
  qualification?: string;
  experience?: string;
  date_of_birth?: string;       // YYYY-MM-DD
  hired_date: string;           // YYYY-MM-DD
}