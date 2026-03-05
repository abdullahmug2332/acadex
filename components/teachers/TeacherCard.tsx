import { Button } from "@/components/ui/button";
import { SlCalender } from "react-icons/sl";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { BookOpen, Building2, CalendarDays } from "lucide-react";
import { Teacher } from "@/types/Teachers";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import TeacherModal from "./TeacherModal";
import { useState } from "react";
import { deactivateTeacher } from "@/lib/api/teacher";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface TeacherCardProps extends Teacher {
  handleDeactivate: (id: number) => void;
}

export function TeacherCard({
  id,
  first_name,
  last_name,
  uid,
  department,
  hired_date,
  image,
  handleDeactivate,
}: TeacherCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      {/* Header with image and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={image || "/placeholder.svg"}
            alt={`${first_name} ${last_name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {first_name} {last_name}
            </h3>
            <p className="text-sm text-gray-600">{uid}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {/* View button - just triggers modal */}
            <DropdownMenuItem
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-primary" /> View
            </DropdownMenuItem>

            <Link href={`/teacher/edit-teacher/${id}`}>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will move this teacher to trash. You can restore
                    it later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => handleDeactivate(id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Trash
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info sections */}
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <p className="text-gray-600 mb-1">Department</p>
            <p className="font-medium text-gray-900 flex gap-1 items-center">
              <Building2 className="text-primary size-5" />
              {department}
            </p>
          </div>

          {/* Hired Date */}
          <div>
            <p className="text-gray-600 mb-1">Hired Date</p>
            <p className="font-medium text-gray-900 flex gap-1 items-center">
              <CalendarDays className="text-primary size-5" />
              {hired_date ? format(parseISO(hired_date), "MM/dd/yy") : "-"}
            </p>
          </div>

        </div>
      </div>
      {/* Modal outside DropdownMenu */}
      <TeacherModal
        id={id.toString()}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
