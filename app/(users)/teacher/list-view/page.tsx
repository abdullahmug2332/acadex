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
import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import Heading from "@/components/Heading";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CiBoxList } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeacherCard } from "@/components/teachers/TeacherCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Teacher } from "@/types/Teachers";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import TeacherModal from "@/components/teachers/TeacherModal";
import { deactivateTeacher, getTeachers } from "@/lib/api/teacher";
import { toast } from "sonner";
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

export default function Students() {
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("list"); // toggle
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // teachers per page
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [hiredDate, setHiredDate] = useState<Date | undefined>();

  const fetchTeachers = async (page: number) => {
    setLoading(true);
    try {
      const { teachers, total } = await getTeachers(
        "active",
        page,
        limit,
        search,
        department,
        hiredDate ? format(hiredDate, "yyyy-MM-dd") : "",
      );
      setTeachers(teachers);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page, search, department, hiredDate]);

  const totalPages = Math.ceil(total / limit);

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateTeacher(id);
      fetchTeachers(page);
      toast.success("Teacher moved to trash successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <main className="flex flex-col gap-2.5  w-full ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <Heading title="Teachers" />
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

          <Link href={"/teacher/create-teacher"}>
            <Button className="gap-2 bg hbg btn">
              <Plus className="w-4 h-4" />
              Create Teacher
            </Button>
          </Link>
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
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-visible:ring-0"
          />
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Choose Department</SelectLabel>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Computer Science">
                  Computer Science
                </SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !hiredDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {hiredDate ? format(hiredDate, "PPP") : "Hired Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={hiredDate}
                onSelect={setHiredDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-1 items-stretch">
            <Button
              className="w-full"
              onClick={() => {
                setSearch("");
                setDepartment("");
                setHiredDate(undefined);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto ">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                {...teacher}
                handleDeactivate={handleDeactivate}
                
              />
            ))}
          </div>
        ) : (
          <Table className="mSTD-w-full!">
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CNIC</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Hired Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    Loading teachers...
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No teachers found
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <img
                        src={teacher.image}
                        alt={`${teacher.first_name} ${teacher.last_name}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="capitalize">
                      {teacher.first_name} {teacher.last_name}
                    </TableCell>
                    <TableCell>{teacher.uid}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.cnic}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell className="capitalize">
                      {teacher.gender}
                    </TableCell>
                    <TableCell>{teacher.subject_id.join(", ")}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      {teacher.hired_date
                        ? format(parseISO(teacher.hired_date), "MM/dd/yy")
                        : "-"}
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

                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => {
                              setModalOpen(true);
                              setModalId(teacher.id);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-primary" /> View
                          </DropdownMenuItem>

                          <Link href={`/teacher/edit-teacher/${teacher.id}`}>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <Pencil className="w-4 h-4 text-primary" />
                              Edit
                            </DropdownMenuItem>
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                Trash
                              </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will move this teacher to trash.
                                  You can restore it later if needed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeactivate(teacher.id)}
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
                ))
              )}

              <TeacherModal
                id={modalId.toString()}
                open={modalOpen}
                onOpenChange={setModalOpen}
              />
            </TableBody>
          </Table>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 items-center">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`
      px-3 py-1 rounded flex gap-1 items-center
      ${page === 1 ? "bg-primary text-white cursor-not-allowed" : "bg-primary hover:bg-primary"}
    `}
        >
          <IoIosArrowBack />
          Prev
        </Button>

        <span className="px-4 py-1">
          Page {page} of {totalPages}
        </span>

        <Button
          onClick={() => {
            setPage((prev) => Math.min(prev + 1, totalPages));
          }}
          disabled={page === totalPages}
          className={`
      px-3 py-1 rounded flex gap-1 items-center
      ${page === totalPages ? "bg-primary text-white cursor-not-allowed" : "bg-primary hover:bg-primary"}
    `}
        >
          Next
          <IoIosArrowForward />
        </Button>
      </div>
    </main>
  );
}
