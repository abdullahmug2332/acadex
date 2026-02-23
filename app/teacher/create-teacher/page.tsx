"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AddTeacherPage() {
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teacherData = Object.fromEntries(formData.entries());
    console.log("Teacher Data:", teacherData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      e.currentTarget.reset();
      setPreviewUrl("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="mb-6">
          <Heading title="Create Teacher" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to add a new teacher
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              ✓ Teacher added successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-card">
          {/* PERSONAL INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="teacherImage">Teacher Image</Label>
                <div className="border-2 border-dotted border-primary py-1 rounded-md text-primary cursor-pointer  md:w-1/2 lg:w-1/4">
                  <Input
                    id="teacherImage"
                    name="teacherImage"
                    type="file"
                    accept="image/*"
                    className="border-0! shadow-none! cursor-pointer"
                    onChange={(e) =>
                      setPreviewUrl(
                        e.target.files?.[0]
                          ? URL.createObjectURL(e.target.files[0])
                          : "",
                      )
                    }
                  />
                </div>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    className="w-24 h-24 rounded mt-2 border"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
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
                <Label htmlFor="subjects">Subjects</Label>
                <Input id="subjects" name="subjects" required />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" required />
              </div>

              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input id="hireDate" name="hireDate" type="date" required />
              </div>

              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" name="qualification" required />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Add Teacher
            </Button>
            <Button type="reset" variant="outline">
              Clear Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
