import axios from "axios";
import { Teacher } from "@/types/Teachers";
import { TeacherForm } from "@/types/Teachers";



// ✅ Get All Teachers
export const getTeachers = async (
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 10,
  search?: string,
  department?: string,
  hiredDate?: string
): Promise<{ teachers: Teacher[]; total: number }> => {
  const res = await axios.get(`/api/teacher`, {
     params: {
      status,
      page,
      limit,
      search,
      department,
      hired_date: hiredDate,
    },
  });
  return res.data;
};

// ✅ Get Single Teacher by ID
export const getTeacherById = async (id: number): Promise<Teacher> => {
  if (!id) {
    throw new Error("Teacher ID is required");
  }

  try {
    const res = await axios.get<Teacher>(`/api/teacher/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch teacher");
  }
};

// ✅ Add Teacher
export const createTeacher = async (formData: TeacherForm) => {
  try {
    const res = await axios.post("/api/teacher", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Create Teacher Error:", error);
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};


// Soft delete
export const deactivateTeacher = async (id: number) => {
  const res = await axios.delete(`/api/teacher/${id}?type=deactivate`);
  return res.data;
};

// Hard delete
export const deleteTeacher = async (id: number) => {
  const res = await axios.delete(`/api/teacher/${id}?type=delete`);
  return res.data;
};

// Restore teacher
export async function restoreTeacher(id: number) {
  if (!id) {
    throw new Error("Teacher ID is required");
  }

  try {
    const response = await fetch(`/api/teacher/${id}?type=restore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // If API returns an error status
      throw new Error(data.error || "Failed to restore teacher");
    }

    return data; // { message: "Teacher status changed to active" }
  } catch (error: any) {
    console.error("Restore Teacher Error:", error);
    throw error;
  }
}

export const editTeacher = async (id: number, formData: TeacherForm) => {
  if (!id) {
    throw new Error("Teacher ID is required");
  }

  try {
    console.log("formdata",formData)
    const response = await axios.put(`/api/teacher/${id}?type=edit`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // backend should return the updated teacher or success message
  } catch (error: any) {
    console.error("Edit Teacher Error:", error);
    throw new Error(error.response?.data?.error || "Failed to edit teacher");
  }
};