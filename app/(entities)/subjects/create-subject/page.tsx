"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getDepartments } from "@/lib/api/departments";
import { createSubject } from "@/lib/api/subjects";
import { SubjectForm } from "@/types/Subjects";
import { Department } from "@/types/Departments";

export default function CreateSubjectPage() {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<SubjectForm>({
    name: "",
    code: "",
    description: "",
    department_id: null,
  });

  // Fetch active departments for the dropdown
  const fetchDepartments = async () => {
    try {
      const { departments, total } = await getDepartments(
        undefined, // page (ignored)
        undefined, // limit (ignored)
        undefined, // search (ignored)
        undefined, // status (ignored)
        true, // basic = true
      );
      setDepartments(departments);
      console.log("deptList", departments);
    } catch (err: any) {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department_id) {
      toast.error("Please select a department");
      return;
    }
    setLoading(true);
    try {
      await createSubject(formData);
      toast.success("Subject created successfully!");

      // Reset form
      setFormData({
        name: "",
        code: "",
        description: "",
        department_id: null,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <div>
        <div className="mb-6">
          <Heading title="Create Subject" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to create a new subject
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg ">
          {/* Subject Info */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Subject Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Code</Label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department_id?.toString() || ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, department_id: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
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
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Subject"}
          </Button>
        </form>
      </div>
    </div>
  );
}
