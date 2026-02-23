"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import Heading from "@/components/Heading";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
const students = [
  {
    id: "1",
    studentId: "STD202602001",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    studentId: "STD202602002",
    name: "Theresa Webb",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    studentId: "STD202602003",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    id: "1",
    studentId: "STD202602001",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    studentId: "STD202602002",
    name: "Theresa Webb",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    studentId: "STD202602003",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    id: "1",
    studentId: "STD202602001",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    studentId: "STD202602002",
    name: "Theresa Webb",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    studentId: "STD202602003",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
  {
    id: "1",
    studentId: "STD202602001",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    studentId: "STD202602002",
    name: "Theresa Webb",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    studentId: "STD202602003",
    name: "Bessie Cooper",
    grade: 2,
    section: "B",
    enrollmentDate: "7/27/13",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
];

export default function Students() {
  const [selectedRole, setSelectedRole] = useState<string>("student");
  const [showFilter, setShowFilter] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState<"card" | "list">("list"); // toggle

  return (
    <main className="flex flex-col gap-2.5  w-full ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <Heading title="Students" />
        <div className="flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap justify-end">
          {/* Toggle View */}
          <div className="flex items-center gap-2 border p-1 px-3 rounded-md">
            <CiBoxList
              className={cn(
                "size-5 cursor-pointer",
                viewMode === "list" && "text-primary",
              )}
              onClick={() => setViewMode("list")}
            />
            <FaRegAddressCard
              className={cn(
                "size-5 cursor-pointer",
                viewMode === "card" && "text-primary",
              )}
              onClick={() => setViewMode("card")}
            />
          </div>

          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          <Button className="gap-2 bg hbg btn">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilter ? "min-h-[50px] opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
          <Input
            type="text"
            placeholder="Search"
            className="focus-visible:ring-0"
          />
          <Select onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Choose Class</SelectLabel>
                <SelectItem value="first year">First Year</SelectItem>
                <SelectItem value="second year">Second Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Enrollment Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-1 items-stretch">
            <Button className="w-[49%]">Apply</Button>
            <Button variant="outline" className="w-[49%]">
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto ">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <StudentCard key={student.id} {...student} />
              ))}
            </div>
          ) : (
            <Table className="mSTD-w-full! ">
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.enrollmentDate}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Eye className="w-4 h-4 text-primary" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                          <Pencil className="w-4 h-4 text-primary" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 text-red-600 focus:text-red-600" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
          )}
      </div>
      {/* Pagination */}
      <Pagination>
        <PaginationContent className="text-btn-primary">
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
