"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createDepartment } from "@/lib/api/departments";
import { DepartmentForm } from "@/types/Departments";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<DepartmentForm>({
    name: "",
    description: "",
    head_id: "",
  });

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
      await createDepartment({
        ...formData,
        head_id: formData.head_id, // string or number depending on backend
      });

      toast.success("Department created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        head_id: "",
      });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <div>
        <div className="mb-6">
          <Heading title="Create Department" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to create a new department
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
            {loading ? "Creating..." : "Create Department"}
          </Button>
        </form>
      </div>
    </div>
  );
}