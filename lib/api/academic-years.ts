import axios from "axios";
import { AcademicYear, AcademicYearForm, GetAcademicYearsResponse } from "@/types/AcademicYear";

// ✅ Get all Academic Years
export const getAcademicYears = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: "active" | "inactive",
  basic: boolean = false
): Promise<GetAcademicYearsResponse> => {
  const res = await axios.get("/api/academic-years", {
    params: { page, limit, search, status, basic },
  });
  const academic_years = res.data.academic_years ?? res.data.data;
  const total = res.data.total;

  return { academic_years, total };
};

// ✅ Get single Academic Year by ID
export const getAcademicYearById = async (id: number): Promise<AcademicYear> => {
  if (!id) throw new Error("Academic year ID is required");

  try {
    const res = await axios.get<AcademicYear>(`/api/academic-years/${id}`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" },
    });
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching academic year with ID ${id}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch academic year");
  }
};

// ✅ Create Academic Year
export const createAcademicYear = async (formData: AcademicYearForm) => {
  try {
    const res = await axios.post("/api/academic-years", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    console.error("Create Academic Year Error:", error);
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};

// ✅ Edit Academic Year
export const editAcademicYear = async (id: number, formData: AcademicYearForm) => {
  if (!id) throw new Error("Academic year ID is required");
  try {
    const res = await axios.put(`/api/academic-years/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    console.error("Edit Academic Year Error:", error);
    throw new Error(error.response?.data?.error || "Failed to edit academic year");
  }
};

// ✅ Deactivate (soft delete) Academic Year
export const deactivateAcademicYear = async (id: number) => {
  if (!id) throw new Error("Academic year ID is required");
  const res = await axios.patch(`/api/academic-years/${id}?type=deactivate`);
  return res.data;
};

// ✅ Restore Academic Year
export const restoreAcademicYear = async (id: number) => {
  if (!id) throw new Error("Academic year ID is required");
  const res = await axios.patch(`/api/academic-years/${id}?type=restore`);
  return res.data;
};

// ✅ Permanent Delete Academic Year
export const deleteAcademicYear = async (id: number) => {
  if (!id) throw new Error("Academic year ID is required");
  const res = await axios.delete(`/api/academic-years/${id}`);
  return res.data;
};