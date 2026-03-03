import axios from "axios";
import { Staff } from "@/types/Staff";
import { StaffForm } from "@/types/Staff";

// ✅ Get All Staff with pagination, search, department & hire date filter
export const getStaff = async (
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 10,
  search?: string,
  department?: string,
  hireDate?: string
): Promise<{ staff: Staff[]; total: number }> => {
  const res = await axios.get(`/api/staff`, {
    params: {
      status,
      page,
      limit,
      search,
      department,
      hired_date: hireDate,
    },
  });
  return res.data;
};

// ✅ Get Single Staff by ID
export const getStaffById = async (id: number): Promise<Staff> => {
  if (!id) throw new Error("Staff ID is required");

  try {
    const res = await axios.get<Staff>(`/api/staff/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch staff");
  }
};

// ✅ Add Staff
export const createStaff = async (formData: StaffForm) => {
  try {
    const res = await axios.post("/api/staff", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Create Staff Error:", error);
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};

// ✅ Soft delete (Deactivate Staff)
export const deactivateStaff = async (id: number) => {
  const res = await axios.delete(`/api/staff/${id}?type=deactivate`);
  return res.data;
};

// ✅ Hard delete
export const deleteStaff = async (id: number) => {
  const res = await axios.delete(`/api/staff/${id}?type=delete`);
  return res.data;
};

// ✅ Restore Staff
export async function restoreStaff(id: number) {
  if (!id) throw new Error("Staff ID is required");

  try {
    const response = await fetch(`/api/staff/${id}?type=restore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to restore staff");
    return data; // { message: "Staff status changed to active" }
  } catch (error: any) {
    console.error("Restore Staff Error:", error);
    throw error;
  }
}

// ✅ Edit Staff
export const editStaff = async (id: number, formData: StaffForm) => {
  if (!id) throw new Error("Staff ID is required");

  try {
    const response = await axios.put(`/api/staff/${id}?type=edit`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // backend should return the updated staff or success message
  } catch (error: any) {
    console.error("Edit Staff Error:", error);
    throw new Error(error.response?.data?.error || "Failed to edit staff");
  }
};