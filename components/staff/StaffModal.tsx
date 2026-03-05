"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { Staff } from "@/types/Staff";
import { format, parseISO } from "date-fns";
import { getStaffById } from "@/lib/api/staff"; // ✅ your predefined function

interface StaffModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StaffModal({
  id,
  open,
  onOpenChange,
}: StaffModalProps) {
  const [staff, setStaff] = React.useState<Staff | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const fetchStaff = async () => {
      setLoading(true);
      try {
        const data = await getStaffById(Number(id)); // ✅ call API helper
        setStaff(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] max-w-[80%] lg:max-w-[700px]!">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Staff Details
          </DialogTitle>
          <DialogDescription>
            {loading ? "Loading..." : ""}
          </DialogDescription>
        </DialogHeader>

        {!loading && staff && (
          <div className="space-y-4 mt-2">  
            <Table className="w-full   ">
              <TableBody className="grid md:grid-cols-2">
                <TableRow>
                  <TableCell className="font-medium">UID</TableCell>
                  <TableCell>{staff.uid}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="capitalize">
                    {staff.first_name} {staff.last_name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{staff.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">CNIC</TableCell>
                  <TableCell>{staff.cnic}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Phone</TableCell>
                  <TableCell>{staff.phone || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Gender</TableCell>
                  <TableCell className="capitalize">{staff.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">DOB</TableCell>
                  <TableCell>{staff.date_of_birth}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Address</TableCell>
                  <TableCell>{staff.address || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Department</TableCell>
                  <TableCell>{staff.department || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Qualification</TableCell>
                  <TableCell>{staff.qualification || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Experience</TableCell>
                  <TableCell>{staff.experience || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Role</TableCell>
                  <TableCell>{staff.role || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Hired Date</TableCell>
                  <TableCell>
                    {staff.hired_date
                      ? format(parseISO(staff.hired_date), "MM/dd/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created at </TableCell>
                  <TableCell>
                    {staff.created_at
                      ? format(parseISO(staff.created_at), "MM/dd/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="capitalize">
                    {staff.status}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-primary text-white shadow-none hover:bg-primary hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}