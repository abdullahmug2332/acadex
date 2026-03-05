// ✅ Subject as returned by the backend
export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  department_id?: number | null;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

// ✅ Subject form data (for creating or updating a subject)
export interface SubjectForm {
  name: string;
  code: string;
  description?: string;
  department_id?: number | null;
}