"use client";

import React, { useEffect, useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
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
import { PiRecycleLight } from "react-icons/pi";
import { Calendar } from "lucide-react";

import {
  getAcademicYears,
  restoreAcademicYear,
  deleteAcademicYear,
} from "@/lib/api/academic-years";
import AcademicYearModal from "@/components/academic-years/AcademicYearModal";



export default function page() {
  const [academicYears, setAcademicYears] = useState<any[]>([]);
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

  const fetchAcademicYears = async (page: number = 1) => {
    setLoading(true);
    try {
      const { academic_years, total } = await getAcademicYears(
        page,
        limit,
        search,
        "inactive" // 🔥 only trashed academic years
      );
      setAcademicYears(academic_years);
      setTotal(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchAcademicYears(1);
  }, [search]);

  const handleRestore = async (id: number) => {
    try {
      await restoreAcademicYear(id);
      toast.success("Academic year restored successfully");
      fetchAcademicYears(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to restore");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAcademicYear(id);
      toast.success("Academic year permanently deleted");
      fetchAcademicYears(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const truncate = (text: string, maxLength: number = 58) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <main className="flex flex-col gap-2.5 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-0">
        <Heading title="Trashed Academic Years" />
        <div className="flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap justify-end lg:w-[50%] xl:w-[40%]">
          {/* Search */}
          <Input
            placeholder="Search by name..."
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
        </div>
      </div>

      {/* Content */}
      <div className="w-full overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading academic years...</p>
        ) : academicYears.length === 0 ? (
          <p className="text-center text-muted-foreground mt-4">
            No trashed academic years found.
          </p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {academicYears.map((year) => (
              <div
                key={year.id}
                className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-primary mb-1" />
                    <h3 className="font-semibold text-lg mb-2">{year.name}</h3>
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
                          setModalId(year.id);
                        }}
                      >
                        <Eye className="w-4 h-4 text-primary mr-2" /> View
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleRestore(year.id)}>
                        <PiRecycleLight className="w-4 h-4 text-primary mr-2" />
                        Restore
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600 cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Permanently Delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this academic year.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(year.id)}
                              className="bg-red-600 hover:bg-red-700 cursor-pointer"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm mb-2">Start: {year.start_date || "-"}</p>
                <p className="text-sm mb-2">End: {year.end_date || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {academicYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell>{year.name}</TableCell>
                  <TableCell>{year.start_date}</TableCell>
                  <TableCell>{year.end_date}</TableCell>
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
                            setModalId(year.id);
                          }}
                        >
                          <Eye className="w-4 h-4 text-primary mr-2" /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleRestore(year.id)}>
                          <PiRecycleLight className="w-4 h-4 text-primary mr-2" />
                          Restore
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Permanently Delete?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this academic year.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(year.id)}
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                Delete
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

      {/* Modal */}
      <AcademicYearModal
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
