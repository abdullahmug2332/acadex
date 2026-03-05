"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSubjectById, editSubject } from "@/lib/api/subjects";
import { getDepartments } from "@/lib/api/departments";
import { SubjectForm } from "@/types/Subjects";
import { Department } from "@/types/Departments";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/Heading";
import { toast } from "sonner";

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Number(params.id);

  const [subject, setSubject] = useState<SubjectForm | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch subject and departments
  useEffect(() => {
    if (!subjectId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subject
        const subjData = await getSubjectById(subjectId);
        setSubject({
          name: subjData.name,
          code: subjData.code,
          description: subjData.description ?? "",
          department_id: subjData.department_id,
        });

        // Fetch departments (basic list)
        const deptData = await getDepartments(
          undefined,
          undefined,
          undefined,
          undefined,
          true
        );
        setDepartments(deptData.departments);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch subject data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!subject) return;
    const { name, value } = e.target;
    setSubject({ ...subject, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !subjectId) return;

    try {
      setSaving(true);
      await editSubject(subjectId, subject);
      toast.success("Subject updated successfully!");
    } catch (error: any) {
      console.error("Failed to update subject:", error);
      toast.error(error.message || "Failed to update subject");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading subject data...</p>;
  if (!subject) return <p>Subject not found</p>;

  return (
    <div className="bg-background min-h-screen ">
      <div className="">
        <div className="mb-6">
          <Heading title="Edit Subject" />
          <p className="mt-2 text-muted-foreground">
            Update the subject details below
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card  rounded-lg "
        >
          {/* Subject Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Subject Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={subject.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Code</Label>
                <Input
                  name="code"
                  value={subject.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  value={subject.department_id?.toString() || ""}
                  onValueChange={(val) =>
                    setSubject({ ...subject, department_id: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  value={subject.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full mt-5">
            {saving ? "Saving..." : "Update Subject"}
          </Button>
        </form>
      </div>
    </div>
  );
}