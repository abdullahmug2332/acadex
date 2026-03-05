import axios from "axios";
import { Subject } from "@/types/Subjects";
import { SubjectForm } from "@/types/Subjects";

// ✅ Get all Subjects with pagination, search, and status filter
export const getSubjects = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: "active" | "inactive"
): Promise<{ subjects: Subject[]; total: number }> => {
  const res = await axios.get("/api/subjects", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  const { subjects, total } = res.data;
  return { subjects, total };
};

// ✅ Get single Subject by ID
export const getSubjectById = async (id: number): Promise<Subject> => {
  if (!id) throw new Error("Subject ID is required");

  try {
    const res = await axios.get<Subject>(`/api/subjects/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching subject with ID ${id}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch subject");
  }
};

// ✅ Add Subject
export const createSubject = async (formData: SubjectForm) => {
  try {
    const res = await axios.post("/api/subjects", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Create Subject Error:", error);
    throw new Error(error.response?.data?.error || "Something went wrong");
  }
};

// ✅ Edit Subject
export const editSubject = async (id: number, formData: SubjectForm) => {
  if (!id) throw new Error("Subject ID is required");

  try {
    const res = await axios.put(`/api/subjects/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Edit Subject Error:", error);
    throw new Error(error.response?.data?.error || "Failed to edit subject");
  }
};

// ✅ Soft delete (Deactivate / Trash Subject)
export const deactivateSubject = async (id: number) => {
  if (!id) throw new Error("Subject ID is required");
  const res = await axios.patch(`/api/subjects/${id}?type=deactivate`);
  return res.data;
};

// ✅ Restore Subject
export const restoreSubject = async (id: number) => {
  if (!id) throw new Error("Subject ID is required");
  const res = await axios.patch(`/api/subjects/${id}?type=restore`);
  return res.data;
};

// ✅ Permanent Delete Subject
export const deleteSubject = async (id: number) => {
  if (!id) throw new Error("Subject ID is required");
  const res = await axios.delete(`/api/subjects/${id}`);
  return res.data;
};