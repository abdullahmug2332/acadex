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

export default function AddStudentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentData = Object.fromEntries(formData.entries());
    console.log("Student Data:", studentData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      e.currentTarget.reset();
      setSelectedFile(null);
      setPreviewUrl("");
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-background ">
      <div>
        <div className="mb-6">
          <Heading title="Create Student" />
          <p className="mt-2 text-muted-foreground">
            Fill in the form below to add a new student
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg  bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              ✓ Student added successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-card ">
          {/* PERSONAL INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* File Upload at Top */}
              <div className="sm:col-span-2 flex flex-col items-start gap-2">
                <Label htmlFor="studentImage">Student Image</Label>
                <div className="border-2 border-dotted border-primary py-1 rounded-md text-primary cursor-pointer">
                  <Input
                    id="studentImage"
                    name="studentImage"
                    type="file"
                    accept="image/*"
                    className="border-0! shadow-none! cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Selected Student"
                    className="w-24 h-24 object-cover rounded mt-2 border"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  className="w-full!"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  name="bloodGroup"
                  placeholder="Blood Group"
                />
              </div>
            </div>
          </div>

          {/* ACADEMIC INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Academic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="grade">Grade </Label>
                <Input
                  id="grade"
                  name="grade"
                  type="number"
                  placeholder="Grade"
                  required
                />
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  placeholder="eg. A, B, C"
                  required
                />
              </div>

              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  name="enrollmentDate"
                  type="date"
                  required
                />
              </div>
            </div>
          </div>

          {/* GUARDIAN INFO */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Guardian Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="guardianName">Parent / Guardian Name</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  placeholder="Parent / Guardian Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="guardianPhone">Phone</Label>
                <Input
                  id="guardianPhone"
                  name="guardianPhone"
                  placeholder="Phone"
                  type="tel"
                  required
                />
              </div>

              <div>
                <Label htmlFor="guardianEmail">Email</Label>
                <Input
                  id="guardianEmail"
                  name="guardianEmail"
                  placeholder="Email"
                  type="email"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Address"
                  required
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Add Student
            </Button>
            <Button
              type="reset"
              variant="outline"
              onClick={() => setPreviewUrl("")}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
