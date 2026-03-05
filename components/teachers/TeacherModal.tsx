"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { Teacher } from "@/types/Teachers";
import { format, parseISO } from "date-fns";
import { getTeacherById } from "@/lib/api/teacher"; // ✅ use your predefined function

interface TeacherModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TeacherModal({
  id,
  open,
  onOpenChange,
}: TeacherModalProps) {
  const [teacher, setTeacher] = React.useState<Teacher | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const data = await getTeacherById(Number(id)); // ✅ call predefined function
        setTeacher(data);
        console.log(data)
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch teacher");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] max-w-[80%] lg:max-w-[700px]!">
        <DialogHeader>
          <DialogTitle className=" text-primary ">Teacher Details</DialogTitle>
          <DialogDescription>{loading ? "Loading..." : ""}</DialogDescription>
        </DialogHeader>

        {!loading && teacher && (
          <div className="space-y-4 mt-2">
            <Table className="w-full">
              <TableBody className="grid md:grid-cols-2">
                <TableRow>
                  <TableCell className="font-medium ">UID</TableCell>
                  <TableCell>{teacher.uid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium ">Name</TableCell>
                  <TableCell className="capitalize">{`${teacher.first_name} ${teacher.last_name}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CNIC</TableCell>
                  <TableCell>{teacher.cnic}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Phone</TableCell>
                  <TableCell>{teacher.phone || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gender</TableCell>
                  <TableCell className="capitalize">{teacher.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date of Birth</TableCell>
                  <TableCell>
                    {teacher.date_of_birth
                      ? format(parseISO(teacher.date_of_birth), "MM/dd/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Address</TableCell>
                  <TableCell>{teacher.address || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Department</TableCell>
                  <TableCell>{teacher.department || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Subjects</TableCell>
                  <TableCell>{teacher.subject_id?.join(", ") || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Qualification</TableCell>
                  <TableCell>{teacher.qualification || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Experience</TableCell>
                  <TableCell>{teacher.experience ? `${teacher.experience} years` : "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hired Date</TableCell>
                  <TableCell>
                    {teacher.hired_date
                      ? format(parseISO(teacher.hired_date), "MM/dd/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created at</TableCell>
                  <TableCell>
                    {teacher.created_at
                      ? format(parseISO(teacher.created_at), "MM/dd/yyyy")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="capitalize">{teacher.status || "-"}</TableCell>
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