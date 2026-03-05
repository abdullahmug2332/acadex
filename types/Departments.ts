// types/Departments.ts

// Represents a Department as stored in the database
export interface Department {
  id: number;
  name: string;
  description?: string | null;
  head_id: number | string; // depending if you store the head temporarily as string
  status: "active" | "inactive";
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

// Represents the data required to create or edit a Department
export interface DepartmentForm {
  name: string;
  description?: string;
  head_id: number | string;
}
export interface GetDepartmentsResponse {
  departments: Department[];
  total: number;
}