"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createStaff } from "@/lib/api/staff";
import { StaffForm } from "@/types/Staff";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<StaffForm>({
    first_name: "",
    last_name: "",
    email: "",
    cnic: "",
    phone: "",
    gender: "male",
    date_of_birth: "",
    address: "",
    department: "",
    role: "",
    qualification: "",
    experience: "",
    hired_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStaff({
        ...formData,
        experience: (formData.experience), // ✅ convert to number
      });

      toast.success("Staff created successfully!");

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        cnic: "",
        phone: "",
        gender: "male",
        date_of_birth: "",
        address: "",
        department: "",
        role: "",
        qualification: "",
        experience: "",
        hired_date: "",
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
          <Heading title="Create Staff" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to create new staff
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg">
          
          {/* PERSONAL INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <Label>First Name</Label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>CNIC</Label>
                <Input
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Gender</Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-1.5 border-primary/30"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* PROFESSIONAL INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Professional Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <Label>Department</Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Role</Label>
                <Input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Qualification</Label>
                <Input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Hired Date</Label>
                <Input
                  type="date"
                  name="hired_date"
                  value={formData.hired_date}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Staff"}
          </Button>

        </form>
      </div>
    </div>
  );
}