"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createAcademicYear } from "@/lib/api/academic-years";
import { AcademicYearForm } from "@/types/AcademicYear";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AcademicYearForm>({
    name: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData({
      ...formData,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAcademicYear(formData);

      toast.success("Academic year created successfully!");

      // Reset form
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
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
          <Heading title="Create Academic Year" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to create a new academic year
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg">

          {/* Academic Year Info */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Academic Year Information</h2>
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
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>

           

            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Academic Year"}
          </Button>
        </form>
      </div>
    </div>
  );
}