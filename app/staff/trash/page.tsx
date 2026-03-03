"use client";

import { useEffect, useState } from "react";
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
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { getStaff, deactivateStaff, deleteStaff, restoreStaff } from "@/lib/api/staff"; // Your staff APIs
import StaffModal from "@/components/StaffModal";
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
import { TrashStaffCard } from "@/components/TrashStaffCard";

export default function StaffPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [hireDate, setHireDate] = useState<Date | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number>(0);

  const fetchStaff = async (page: number) => {
    setLoading(true);
    try {
      const { staff, total } = await getStaff(
        "inactive",
        page,
        limit,
        search,
        department,
        hireDate ? format(hireDate, "yyyy-MM-dd") : "",
      );
      setStaffList(staff);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(page);
  }, [page, search, department, hireDate]);

  const totalPages = Math.ceil(total / limit);

   const handlePermanentDelete = async (id: number) => {
    try {
      await deleteStaff(id);
      toast.success("Staff deleted successfully");
      fetchStaff(page);
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  const handleRestoreStaff = async (id: number) => {
    try {
      await restoreStaff(id);
      toast.success("Staff restored successfully");
      fetchStaff(page);
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="flex flex-col gap-2.5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Heading title="Trashed Staff" />

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-end">
          {/* Toggle */}
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
            className="gap-2"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <Filter className="w-4 h-4" />
            Filter
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
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department</SelectLabel>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="Library">Library</SelectItem>
                <SelectItem value="Front Office">Front Office</SelectItem>
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
                {hireDate ? format(hireDate, "PPP") : "Hire Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={hireDate}
                onSelect={setHireDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Button
              onClick={() => {
                setSearch("");
                setDepartment("");
                setHireDate(undefined);
                setPage(1);
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full overflow-x-auto">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>Loading staff...</p>
            ) : staffList.length === 0 ? (
              <p className="col-span-3 text-center">No staff found</p>
            ) : (
              staffList.map((item) => (
                <TrashStaffCard
                  key={item.id}
                  {...item}
                  handlePermanentDelete={handlePermanentDelete}
                  handleRestoreStaff={handleRestoreStaff}
                />
              ))
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading staff...
                  </TableCell>
                </TableRow>
              ) : staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No staff found
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <img
                        src={staff.image || "/avatar.png"}
                        alt={staff.first_name + " " + staff.last_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      {staff.first_name} {staff.last_name}
                    </TableCell>
                    <TableCell>{staff.uid}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      {staff.hired_date
                        ? format(parseISO(staff.hired_date), "MM/dd/yy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setModalOpen(true);
                            setModalId(staff.id);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2 text-primary" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRestoreStaff(staff.id)}
                        >
                          <PiRecycleLight className="w-4 h-4 text-primary mr-2" />
                          Restore
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 hover:text-red-600!"
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600 hover:text-red-600!" />
                              Permanent Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Permanently?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this staff.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handlePermanentDelete(staff.id)
                                }
                                className="bg-red-600 hover:bg-red-600!"
                              >
                                Permanent Delete
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
              <StaffModal
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
          className="px-3 py-1 rounded flex gap-1 items-center bg-primary text-white hover:bg-primary"
        >
          Prev
        </Button>
        <span className="px-4 py-1">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded flex gap-1 items-center bg-primary text-white hover:bg-primary"
        >
          Next
        </Button>
      </div>
    </main>
  );
}
