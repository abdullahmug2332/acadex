"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import {
  getAcademicYearById,
  editAcademicYear,
} from "@/lib/api/academic-years";
import { AcademicYearForm } from "@/types/AcademicYear";
import { format, parseISO } from "date-fns";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editAcademicYear(id, formData);
      toast.success("Academic year updated successfully!");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const fetchAcademicYear = async () => {
    try {
      const data = await getAcademicYearById(id);

      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        return dateString.split("T")[0]; // safe YYYY-MM-DD for <input type="date">
      };

      setFormData({
        name: data.name,
        start_date: formatDateForInput(data.start_date),
        end_date: formatDateForInput(data.end_date),
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch academic year");
    } finally {
      setFetching(false);
    }
  };

  if (id) fetchAcademicYear();
}, [id]);

  if (fetching) {
    return <p className="text-muted-foreground">Loading academic year...</p>;
  }

  return (
    <div className="bg-background">
      <div>
        <div className="mb-6">
          <Heading title="Edit Academic Year" />
          <p className="mt-2 text-muted-foreground">
            Update the academic year information below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg">
          {/* Academic Year Info */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Academic Year Information
            </h2>

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
            {loading ? "Updating..." : "Update Academic Year"}
          </Button>
        </form>
      </div>
    </div>
  );
}
