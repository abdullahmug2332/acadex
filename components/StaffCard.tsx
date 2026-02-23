import { Building2, CalendarDays, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffCardProps {
  name: string;
  staffId: string;
  role: string;
  department: string;
  hireDate: string;
  image: string;
}

export function StaffCard({
  name,
  staffId,
  role,
  department,
  hireDate,
  image,
}: StaffCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{staffId}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <p className="text-gray-600 mb-1">Role</p>
          <p className="font-medium flex items-center gap-2">
            <BadgeCheck className="text-primary size-5" />
            {role}
          </p>
        </div>

        <div>
          <p className="text-gray-600 mb-1">Department</p>
          <p className="font-medium flex items-center gap-2">
            <Building2 className="text-primary size-5" />
            {department}
          </p>
        </div>

        <div>
          <p className="text-gray-600 mb-1">Hired Date</p>
          <p className="font-medium flex items-center gap-2">
            <CalendarDays className="text-primary size-5" />
            {hireDate}
          </p>
        </div>
      </div>
    </div>
  );
}