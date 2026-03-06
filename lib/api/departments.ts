import axios from "axios";
import { Department } from "@/types/Departments";
import { DepartmentForm } from "@/types/Departments"; 
import { GetDepartmentsResponse } from "@/types/Departments"; 

export const getDepartments = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: "active" | "inactive",
  basic: boolean = false
): Promise<GetDepartmentsResponse> => {
  const res = await axios.get("/api/departments", {
    params: {
      page,
      limit,
      search,
      status,
      basic, // send basic=true if you want the minimal list
    },
  });
  const departments = res.data.departments ?? res.data.data;
  const total = res.data.total;

  return { departments, total };
};
// ✅ Get single Department by ID
export const getDepartmentById = async (id: number): Promise<Department> => {
  if (!id) throw new Error("Department ID is required");

  try {
    const res = await axios.get<Department>(`/api/departments/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch department");
  }
};

// ✅ Add Department
export const createDepartment = async (formData: DepartmentForm) => {
  try {
    const res = await axios.post("/api/departments", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Create Department Error:", error);
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};

// ✅ Edit Department
export const editDepartment = async (id: number, formData: DepartmentForm) => {
  if (!id) throw new Error("Department ID is required");

  try {
    const res = await axios.put(`/api/departments/${id}?type=edit`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Edit Department Error:", error);
    throw new Error(error.response?.data?.error || "Failed to edit department");
  }
};

// ✅ Soft delete (Deactivate Department)
export const deactivateDepartment = async (id: number) => {
  if (!id) throw new Error("Department ID is required");
  const res = await axios.patch(`/api/departments/${id}?type=deactivate`);
  return res.data;
};

// ✅ Restore Department
export const restoreDepartment = async (id: number) => {
  if (!id) throw new Error("Department ID is required");
  const res = await axios.patch(`/api/departments/${id}?type=restore`);
  return res.data;
};

// ✅ Permanent Delete Department
export const deleteDepartment = async (id: number) => {
  if (!id) throw new Error("Department ID is required");
  const res = await axios.delete(`/api/departments/${id}?type=delete`);
  return res.data;
};