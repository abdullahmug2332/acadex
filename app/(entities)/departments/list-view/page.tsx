"use client";

import React, { useEffect, useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { Filter, PenIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { cn } from "@/lib/utils";
import DepartmentModal from "@/components/departments/DepartmentModal";
import {
  getDepartments,
  deactivateDepartment,
  restoreDepartment,
  deleteDepartment,
} from "@/lib/api/departments";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2 } from "lucide-react";

export default function DepartmentsList() {
  const [department, setDepartment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchDepartments = async (page: number = 1) => {
    setLoading(true);
    try {
      const { departments, total } = await getDepartments(
        page,
        limit,
        search,
        "active",
      );
      setDepartment(departments);
      setTotal(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchDepartments(1);
  }, [search]);

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateDepartment(id);
      toast.success(  "Department moved to trash successfully");
      fetchDepartments(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate");
    }
  };

  // Utility to truncate text
  const truncate = (text: string, maxLength: number = 58) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <main className="flex flex-col gap-2.5 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-0">
        <Heading title="Departments" />
        <div className="flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap justify-end lg:w-[50%] xl:w-[40%]">
          {/* Search */}
          <Input
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow! flex-1! py-1! min-w-[200px]"
          />
          <div className="flex items-center gap-2 p-1 px-3 rounded-md border">
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
          <Link href={"/departments/create-department"}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Department
            </Button>
          </Link>
        </div>
      </div>

      {/* Departments Table/Card */}
      <div className="w-full overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading departments...</p>
        ) : (department?.length ?? 0) === 0 ? (
          <p className="text-center text-muted-foreground mt-4">
            No departments found.
          </p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <Building2 className="text-primary text-[20px]" />
                    <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setModalOpen(true);
                          setModalId(dept.id);
                        }}
                      >
                        <Eye className="w-4 h-4 text-primary mr-2" /> View
                      </DropdownMenuItem>

                      <Link href={`/departments/edit-department/${dept.id}`}>
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 text-primary mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                            Trash
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will move this department to trash.
                              You can restore it later if needed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeactivate(dept.id)}
                              className="bg-red-600 hover:bg-red-700 cursor-pointer"
                            >
                              Yes, Trash
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm mb-2">{truncate(dept.description)}</p>
                <p className="text-sm font-medium mb-2">Head: {dept.head_id}</p>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {department.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{truncate(dept.description)}</TableCell>
                  <TableCell>{dept.head_id}</TableCell>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setModalOpen(true);
                            setModalId(dept.id);
                          }}
                        >
                          <Eye className="w-4 h-4 text-primary mr-2" /> View
                        </DropdownMenuItem>

                        <Link href={`/departments/edit-department/${dept.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 text-primary mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                              Trash
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will move this department to trash.
                                You can restore it later if needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeactivate(dept.id)}
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                Yes, Trash
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <DepartmentModal
        id={modalId.toString()}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 items-center">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={cn(
            page === 1
              ? "bg-primary text-white cursor-not-allowed"
              : "bg-primary hover:bg-primary",
            "px-3 py-1 rounded flex gap-1 items-center",
          )}
        >
          <IoIosArrowBack /> Prev
        </Button>

        <span className="px-4 py-1">
          Page {page} of {totalPages}
        </span>

        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={cn(
            page === totalPages
              ? "bg-primary text-white cursor-not-allowed"
              : "bg-primary hover:bg-primary",
            "px-3 py-1 rounded flex gap-1 items-center",
          )}
        >
          Next <IoIosArrowForward />
        </Button>
      </div>
    </main>
  );
}
