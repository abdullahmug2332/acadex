"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getDepartmentById, editDepartment } from "@/lib/api/departments";
import { DepartmentForm } from "@/types/Departments";

export default function Page() {
  const params = useParams(); // get department id from route
  const departmentId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState<DepartmentForm>({
    name: "",
    description: "",
    head_id: "",
  });

  // Fetch department data
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setFetching(true);
        const data = await getDepartmentById(departmentId);
        setFormData({
          name: data.name,
          description: data.description || "",
          head_id: String(data.head_id || ""), // convert to string for input
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch department");
      } finally {
        setFetching(false);
      }
    };

    if (departmentId) fetchDepartment();
  }, [departmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editDepartment(departmentId, formData);
      toast.success("Department updated successfully!");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center py-10">Loading department data...</p>;
  }

  return (
    <div className="bg-background">
      <div>
        <div className="mb-6">
          <Heading title="Edit Department" />
          <p className="mt-2 text-muted-foreground">
            Update the department information below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg">

          {/* Department Info */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Department Information</h2>
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
                <Label>Head (Temporary: Name or ID)</Label>
                <Input
                  name="head_id"
                  value={formData.head_id}
                  onChange={handleChange}
                  required
                />
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
            {loading ? "Updating..." : "Update Department"}
          </Button>
        </form>
      </div>
    </div>
  );
}