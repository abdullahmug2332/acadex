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

interface TeacherCardProps {
  id: string;
  name: string;
  teacherId: string;
  subjects: string;
  department: string;
  hireddate: string;
  image: string;
}

export function TeacherCard({
  name,
  teacherId,
  subjects,
  department,
  hireddate,
  image,
}: TeacherCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      {/* Header with image and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{teacherId}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
              {hireddate}
            </p>
          </div>

          {/* Subjects - Full Row */}
          <div className="col-span-2">
            <p className="text-gray-600 mb-1">Subjects</p>
            <p className="font-medium text-gray-900 flex gap-1 items-center">
              <BookOpen className="text-primary size-5" />
              {subjects}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
