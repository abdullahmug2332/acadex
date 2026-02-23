"use client";

import { useState } from "react";
import Heading from "@/components/Heading";
import { StaffCard } from "@/components/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


// ✅ Staff Dummy Data
const staff = [
  {
    id: "1",
    staffId: "STF2026001",
    name: "David Miller",
    role: "Accountant",
    department: "Administration",
    hireDate: "06/12/2019",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: "2",
    staffId: "STF2026002",
    name: "Sophia Johnson",
    role: "Receptionist",
    department: "Front Office",
    hireDate: "03/15/2020",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: "3",
    staffId: "STF2026003",
    name: "Michael Brown",
    role: "Librarian",
    department: "Library",
    hireDate: "09/21/2018",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
  },
];

export default function StaffPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="flex flex-col gap-2.5 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Heading title="Staff" />

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-end">
          
          {/* Toggle */}
          <div className="flex items-center gap-2 border p-1 px-3 rounded-md">
            <CiBoxList
              className={cn(
                "size-5 cursor-pointer",
                viewMode === "list" && "text-primary"
              )}
              onClick={() => setViewMode("list")}
            />
            <FaRegAddressCard
              className={cn(
                "size-5 cursor-pointer",
                viewMode === "card" && "text-primary"
              )}
              onClick={() => setViewMode("card")}
            />
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showFilter ? "min-h-[50px] opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
          
          <Input placeholder="Search staff..." />

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department</SelectLabel>
                <SelectItem value="admin">Administration</SelectItem>
                <SelectItem value="library">Library</SelectItem>
                <SelectItem value="office">Front Office</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Hire Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Button className="w-[49%]">Apply</Button>
            <Button variant="outline" className="w-[49%]">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full overflow-x-auto">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((item) => (
              <StaffCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.staffId}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.hireDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2 text-primary" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 mr-2 text-primary" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2 text-red-600" />
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
        <PaginationContent>
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