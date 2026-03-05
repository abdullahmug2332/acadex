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
import { format, parseISO } from "date-fns";

import { getSubjectById } from "@/lib/api/subjects";
import { getDepartmentById } from "@/lib/api/departments";

interface SubjectModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubjectModal({
  id,
  open,
  onOpenChange,
}: SubjectModalProps) {
  const [subject, setSubject] = React.useState<any | null>(null);
  const [departmentName, setDepartmentName] = React.useState<string>("-");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const fetchSubject = async () => {
      setLoading(true);
      try {
        const data = await getSubjectById(Number(id));
        setSubject(data);

        // fetch department name
        if (data.department_id) {
          const dept = await getDepartmentById(data.department_id);
          setDepartmentName(dept.name);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Subject Details</DialogTitle>
          <DialogDescription>{loading ? "Loading..." : ""}</DialogDescription>
        </DialogHeader>

        {!loading && subject && (
          <div className="space-y-4 mt-2">
            <Table className="w-full">
              <TableBody>

                <TableRow>
                  <TableCell className="font-medium">ID</TableCell>
                  <TableCell>{subject.id}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{subject.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Code</TableCell>
                  <TableCell>{subject.code}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Department</TableCell>
                  <TableCell>{departmentName}</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>
                    {subject.created_at
                      ? format(parseISO(subject.created_at), "MM/dd/yyyy")
                      : "-"}
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