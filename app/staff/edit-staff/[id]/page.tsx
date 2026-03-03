"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { editStaff, getStaffById } from "@/lib/api/staff";
import { Staff, StaffForm } from "@/types/Staff";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const [paramId, setParamId] = useState<number>(0);

  const [formData, setFormData] = useState<StaffForm>({
    first_name: "",
    last_name: "",
    email: "",
    cnic: "",
    phone: "",
    gender: "male",
    date_of_birth: "", // ✅ added
    address: "",
    department: "",
    role: "",
    qualification: "", // ✅ added
    experience: "", // ✅ added
    hired_date: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch staff on load
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const resolvedParams = await params;
        const numberId = Number(resolvedParams.id);

        if (isNaN(numberId)) throw new Error("Invalid staff ID");

        setParamId(numberId);

        const staff: Staff = await getStaffById(numberId);

        const formatDateForInput = (dateString?: string) => {
          if (!dateString) return "";
          console.log("dateString", dateString);
          return dateString.slice(0, 10); // "YYYY-MM-DD"
        };

        setFormData({
          first_name: staff.first_name || "",
          last_name: staff.last_name || "",
          email: staff.email || "",
          cnic: staff.cnic || "",
          phone: staff.phone || "",
          gender: staff.gender || "male",
          date_of_birth: formatDateForInput(staff.date_of_birth ?? undefined), // ✅
          address: staff.address || "",
          department: staff.department || "",
          role: staff.role || "",
          qualification: staff.qualification || "", // ✅
          experience: staff.experience?.toString() || "", // ✅
          hired_date: formatDateForInput(staff.hired_date ?? undefined),
        });
      } catch (err: any) {
        toast.error(`Error fetching staff: ${err.message}`);
      }
    };

    fetchStaff();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      await editStaff(paramId, formData);
      toast.success("Staff edited successfully.");
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
          <Heading title="Edit Staff" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to edit staff
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
                  placeholder="1234512345671"
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
