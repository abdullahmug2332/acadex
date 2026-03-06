export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
  created_at:string;
  updated_at:string;
}

export interface AcademicYearForm {
  name: string;
  start_date: string;
  end_date: string;
}

export interface GetAcademicYearsResponse {
  academic_years: AcademicYear[];
  total: number;
}