import { Building2, CalendarDays, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import StaffModal from "./StaffModal";
import { format, parseISO } from "date-fns";
import { PiRecycleLight } from "react-icons/pi";
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

interface TrashStaffCardProps {
  id: number;
  first_name: string;
  last_name: string;
  uid: string;
  role: string;
  department: string;
  hired_date: string;
  image: string;
  handleRestoreStaff: (id: number) => void;
  handlePermanentDelete: (id: number) => void;
}

export function TrashStaffCard({
  id,
  first_name,
  last_name,
  uid,
  role,
  department,
  hired_date,
  image,
  handleRestoreStaff,
  handlePermanentDelete,
}: TrashStaffCardProps) {
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
            {/* View */}
            <DropdownMenuItem
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-primary" /> View
            </DropdownMenuItem>

            {/* Restore */}
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleRestoreStaff(id)}
            >
              <PiRecycleLight className="w-4 h-4 text-primary" /> Restore
            </DropdownMenuItem>

            {/* Permanent Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600 hover:text-red-600! cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="w-4 h-4 text-red-600 hover:text-red-600!" />
                  Permanent Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this staff member from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handlePermanentDelete(id)}
                    className="bg-red-600 hover:bg-red-700!"
                  >
                    Permanent Delete
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
          {/* Role */}
          <div className="col-span-2">
            <p className="text-gray-600 mb-1">Role</p>
            <p className="font-medium flex items-center gap-2">
              <BadgeCheck className="text-primary size-5" />
              {role}
            </p>
          </div>

          {/* Department */}
          <div>
            <p className="text-gray-600 mb-1">Department</p>
            <p className="font-medium flex items-center gap-2">
              <Building2 className="text-primary size-5" />
              {department}
            </p>
          </div>

          {/* Hired Date */}
          <div>
            <p className="text-gray-600 mb-1">Hired Date</p>
            <p className="font-medium flex items-center gap-2">
              <CalendarDays className="text-primary size-5" />
              {hired_date ? format(parseISO(hired_date), "MM/dd/yyyy") : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        id={id.toString()}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}