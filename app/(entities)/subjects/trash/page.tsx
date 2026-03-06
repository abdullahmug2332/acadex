"use client";

import React, { useEffect, useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { Building2, Plus } from "lucide-react";
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
import { MoreVertical, Eye, Trash2, Pencil, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { cn } from "@/lib/utils";
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

import {
  getSubjects,
  deactivateSubject,
  getSubjectById,
  deleteSubject,
  restoreSubject,
} from "@/lib/api/subjects";
import { getDepartmentById } from "@/lib/api/departments";
import SubjectModal from "@/components/subjects/SubjectsModal";
import { PiRecycleLight } from "react-icons/pi";

export default function SubjectsList() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentNames, setDepartmentNames] = useState<
    Record<number, string>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number>(0);
  useEffect(() => {
    const fetchDepartmentNames = async () => {
      const map: Record<number, string> = {};

      for (const subject of subjects) {
        try {
          const dept = await getDepartmentById(subject.department_id);
          map[subject.department_id] = dept.name;
        } catch {
          map[subject.department_id] = "Unknown";
        }
      }

      setDepartmentNames(map);
    };

    if (subjects.length) fetchDepartmentNames();
  }, [subjects]);

  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchSubjects = async (page: number = 1) => {
    setLoading(true);
    try {
      const { subjects, total } = await getSubjects(
        page,
        limit,
        search,
        "inactive",
      );

      setSubjects(subjects);
      setTotal(total);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchSubjects(1);
  }, [search]);

  const handlePermanentDelete = async (id: number) => {
    try {
      await deleteSubject(id);
      toast.success("Subject permanently deleted successfully");
      fetchSubjects(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to permanently delete subject");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreSubject(id);
      toast.success("Subject restored successfully");
      fetchSubjects(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to restore");
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
        <Heading title="Trahsed Subjects" />

        <div className="flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap justify-end lg:w-[50%] xl:w-[40%]">
          {/* Search */}
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow! flex-1! py-1! min-w-[200px]"
          />

          {/* View Mode */}
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

      {/* Subjects Table/Card */}

      <div className="w-full overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="text-center text-muted-foreground mt-4">
            No subjects found.
          </p>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2 items-center">
                    <BookOpen className="text-primary text-[20px]" />
                    <h3 className="font-semibold text-lg">{subject.code}</h3>
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
                          setModalId(subject.id);
                        }}
                      >
                        <Eye className="w-4 h-4 text-primary mr-2" /> View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleRestore(subject.id)}
                      >
                        <PiRecycleLight className="w-4 h-4 text-primary mr-2" />{" "}
                        Restore
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600 hover:text-red-600!"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600 " />
                            Permanent Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete the subject.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handlePermanentDelete(subject.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Permanent delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="font-semibold text-lg "> {subject.name}</p>
                <p className="text-sm mb-2">{truncate(subject.description)}</p>

                <p className=" mb-2 flex gap-1 items-center text-md">
                  <Building2 className="text-primary size-5 !" />{" "}
                  {departmentNames[subject.department_id] || "Loading..."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{truncate(subject.description)}</TableCell>
                  <TableCell>
                    {departmentNames[subject.department_id] || "Loading..."}
                  </TableCell>

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
                            setModalId(subject.id);
                          }}
                        >
                          <Eye className="w-4 h-4 text-primary mr-2" /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleRestore(subject.id)}
                        >
                          <PiRecycleLight className="w-4 h-4 text-primary mr-2" />{" "}
                          Restore
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600 hover:text-red-600!"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600 " />
                              Permanent Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently delete the subject.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() =>
                                  handlePermanentDelete(subject.id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Permanent delete
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
      <SubjectModal
        id={modalId.toString()}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Pagination */}

      <div className="flex justify-center mt-4 gap-2 items-center">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded flex gap-1 items-center"
        >
          <IoIosArrowBack /> Prev
        </Button>

        <span className="px-4 py-1">
          Page {page} of {totalPages}
        </span>

        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded flex gap-1 items-center"
        >
          Next <IoIosArrowForward />
        </Button>
      </div>
    </main>
  );
}
