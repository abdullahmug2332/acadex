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
import { getDepartmentById } from "@/lib/api/departments"; // API helper

interface DepartmentModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DepartmentModal({
  id,
  open,
  onOpenChange,
}: DepartmentModalProps) {
  const [department, setDepartment] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const data = await getDepartmentById(Number(id));
        setDepartment(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch department");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Department Details</DialogTitle>
          <DialogDescription>{loading ? "Loading..." : ""}</DialogDescription>
        </DialogHeader>

        {!loading && department && (
          <div className="space-y-4 mt-2">
            <Table className="w-full">
              <TableBody className="">
                <TableRow>
                  <TableCell className="font-medium">ID</TableCell>
                  <TableCell>{department.id}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{department.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Head</TableCell>
                  <TableCell>{department.head_id || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="capitalize">
                    {department.status}
                  </TableCell>
                </TableRow>
                <TableRow className="items-center">
                  <TableCell className="font-medium ">
                    Description
                  </TableCell>
                  <TableCell className="whitespace-normal break-words  max-w-full" >{department.description || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>
                    {department.created_at
                      ? format(parseISO(department.created_at), "MM/dd/yyyy")
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
